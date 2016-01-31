/**
	Function parameter-type validation routine.

	For example, if you had this function:

		function myFunction(arg1, arg2, arg3) {
            validate(String, MyCtrl, Boolean);
            console.log("Arguments validated sucessfully")
        }

    Then the validate call will raise an exception if the arguments, in order, don't
    match the types provided. If null/undefined is passed, the validation will skip
    that n-th argument in validation (useful for optional parameters).
*/

module.exports = function validate() {
	var args = arguments.callee.caller.arguments;
	var expected = arguments;
	for(var i=0; i<args.length; i++) {
		if(expected[i]) {
			switch(expected[i]) {
				case Boolean:
					if(typeof(args[i]) != "boolean" && !(args[i] instanceof Boolean)){
						throw new Error("Argument " + (i+1) + " failed Boolean type validation.")
					}
					break;
				case Number:
					if(typeof(args[i]) != "number" && !(args[i] instanceof Number)){
						throw new Error("Argument " + (i+1) + " failed Number type validation.")
					}
					break;
				case String:
					if(typeof(args[i]) != "string" && !(args[i] instanceof String)){
						throw new Error("Argument " + (i+1) + " failed String type validation.")
					}
					break;
				case Array:
					if(!(Array.isArray && Array.isArray(args[i])) && Object.prototype.toString.call(args[i]) != '[object Array]'){
						throw new Error("Argument " + (i+1) + " failed Array type validation.")
					}
					break;
				case Object:
					if(typeof(args[i]) != "object" && !(args[i] instanceof Object) && Object.prototype.toString.call(args[i]) != '[object Object]'){
						throw new Error("Argument " + (i+1) + " failed Object type validation.")
					}
					break;
				case Function:
					if(typeof(args[i]) != "function" && !(args[i] instanceof Function) && Object.prototype.toString.call(args[i]) != '[object Function]'){
						throw new Error("Argument " + (i+1) + " failed Object type validation.")
					}
					break;
				default:
					if(!(args[i] instanceof expected[i])){
						var name = expected[i].name || expected[i].prototype.kindName || "Object";
						throw new Error("Argument " + (i+1) + " failed " + name + " type validation.")
					}
			}
		}
	}
};
