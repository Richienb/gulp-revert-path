'use strict';
var path = require('path');
var assert = require('assert');
var gutil = require('gulp-util');
var through = require('through2');
var revertPath = require('./');

it('reverts the path to the previous one', function (done) {
	var s = through.obj(function (file, enc, cb) {
		assert.strictEqual(path.extname(file.path), '.foo');
		file.path = gutil.replaceExtension(file.path, '.bar');
		assert.strictEqual(path.extname(file.path), '.bar');
		assert.strictEqual(file.history.length, 2);
		cb(null, file);
	});

	s.pipe(revertPath()).pipe(through.obj(function (file, enc, cb) {
		assert.strictEqual(path.extname(file.path), '.foo');
		assert.strictEqual(path.extname(file.history[0]), '.foo');
		assert.strictEqual(file.history.length, 1);
		cb();
	}));

	s.on('end', done);

	s.write(new gutil.File({
		cwd: __dirname,
		base: __dirname + '/fixture',
		path: __dirname + '/fixture/fixture.foo',
		contents: new Buffer('')
	}));

	s.end();
});

it('reverts the path to the previous two', function (done) {
	var s = through.obj(function (file, enc, cb) {
		assert.strictEqual(path.extname(file.path), '.foo');
		file.path = gutil.replaceExtension(file.path, '.bar');
		assert.strictEqual(path.extname(file.path), '.bar');
		file.path = gutil.replaceExtension(file.path, '.baz');
		assert.strictEqual(path.extname(file.path), '.baz');
		assert.strictEqual(file.history.length, 3);
		cb(null, file);
	});

	s.pipe(revertPath(2)).pipe(through.obj(function (file, enc, cb) {
		assert.strictEqual(path.extname(file.path), '.foo');
		assert.strictEqual(path.extname(file.history[0]), '.foo');
		assert.strictEqual(file.history.length, 1);
		cb();
	}));

	s.on('end', done);

	s.write(new gutil.File({
		cwd: __dirname,
		base: __dirname + '/fixture',
		path: __dirname + '/fixture/fixture.foo',
		contents: new Buffer('')
	}));

	s.end();
});

it('successfully processes files with unmodified paths', function (done) {
	var s = through.obj(function (file, enc, cb) {
		assert.strictEqual(path.extname(file.path), '.foo');
		assert.deepEqual(path.extname(file.history[0]), '.foo');
		assert.strictEqual(file.history.length, 1);
		cb(null, file);
	});

	s.pipe(revertPath()).pipe(through.obj(function (file, enc, cb) {
		assert.strictEqual(path.extname(file.path), '.foo');
		assert.deepEqual(path.extname(file.history[0]), '.foo');
		assert.strictEqual(file.history.length, 1);
		cb();
	}));

	s.on('end', done);

	s.write(new gutil.File({
		cwd: __dirname,
		base: __dirname + '/fixture',
		path: __dirname + '/fixture/fixture.foo',
		contents: new Buffer('')
	}));

	s.end();
});

it('reverts as much as possible', function (done) {
	var s = through.obj(function (file, enc, cb) {
		assert.strictEqual(path.extname(file.path), '.foo');
		file.path = gutil.replaceExtension(file.path, '.bar');
		assert.strictEqual(path.extname(file.path), '.bar');
		file.path = gutil.replaceExtension(file.path, '.baz');
		assert.strictEqual(path.extname(file.path), '.baz');
		assert.strictEqual(file.history.length, 3);
		cb(null, file);
	});

	s.pipe(revertPath(100)).pipe(through.obj(function (file, enc, cb) {
		assert.strictEqual(path.extname(file.path), '.foo');
		assert.deepEqual(path.extname(file.history[0]), '.foo');
		assert.strictEqual(file.history.length, 1);
		cb();
	}));

	s.on('end', done);

	s.write(new gutil.File({
		cwd: __dirname,
		base: __dirname + '/fixture',
		path: __dirname + '/fixture/fixture.foo',
		contents: new Buffer('')
	}));

	s.end();
});
