/*
	Usage:

		node /path/to/ext-deploy.js enyoPath extSrcPath

	For example, you could just add the following to the end of bootplate deploy scripts to automate the process

		deploy.bat

			REM deploy any external components
			(echo.)
			%NODE% "%TOOLS%\..\lib\lazy\tools\ext-deploy.js" "%ENYO%" "%TOOLS%\..\ext"

		deploy.sh

			# deploy any external components
			echo " "
			node "$TOOLS/../lib/lazy/tools/ext-deploy.js" "$ENYO" "$TOOLS/../ext"
	
*/

var path = require("path"),
	fs = require("fs"),
	spawn = require("child_process").spawn,
	enyo = process.argv[2],
	extSrc = process.argv[3];

var minify = path.join(enyo, "tools/minifier/minify.js");
var projName = path.basename(path.resolve(path.join(enyo, "..")));
var extName = path.basename(extSrc);
var extDeploy = path.resolve(path.join(enyo, "../deploy", projName, extName));
var srcMap = [];

function deployExternal(name, callback) {
	var src = path.join(extSrc, name, "package.js");
	srcMap.push(extName + "/" + name);
	var child = spawn(process.execPath, [minify, "-destdir", extDeploy, "-output", name, src],
			{cwd: process.cwd(), env: process.env, stdio:"ignore"});
	child.on('exit', function(code) {
		if(code===0) {
			callback();
		} else {
			callback({code:code});
		}
	});
}

function processExternals(exts, callback) {
	if(exts.length==0) {
		callback();
	} else {
		var curr = exts.shift();
		console.log("Minifying " + extName + "/" + curr + "...")
		deployExternal(curr, function(err) {
			if(err) {
				console.error("Unable to deploy: " + extName + "/" + curr);
			}
			processExternals(exts, callback);
		});
	}
}

if(fs.existsSync(extSrc)) {
	var extPkgs = fs.readdirSync(extSrc);
	if(extPkgs.length>0) {
		processExternals(extPkgs, function() {
			console.log("Updating external path references...");
			var appjs = path.join(enyo, "../deploy", projName, "build/app.js");
			var result = fs.readFileSync(appjs, {encoding:"utf8"});
			for(var j=0; j<srcMap.length; j++) {
				var result = result.split(srcMap[j] + "/package.js").join(srcMap[j] + ".js");
				result = result.split(srcMap[j] + "/").join(srcMap[j] + ".js");
				result = result.split(srcMap[j]).join(srcMap[j] + ".js");
				result = result.split(srcMap[j] + ".js.js").join(srcMap[j] + ".js");
			}
			fs.writeFileSync(appjs, result, {encoding:"utf8"});
			console.log("Success: the external components have been added to the deployable project in " + extDeploy);
		});
	}
}
