function test(code) {

	// check(
 //        /* Did you enjoy this little challenge? */
 //        new Buffer( code, 'base64' ).toString( 'ascii' )
 //        , [ 1, 2, 3 ] + [ 3 ] + [ 3, 4, 5, 6, 7, 8 ] == 42
 //      );
 	const tmp = new Buffer( code, 'base64' )
 	console.log(tmp)

 	console.log(tmp.toString.toString())
 	console.log([ 1, 2, 3 ] + [ 3 ] + [ 3, 4, 5, 6, 7, 8 ] == 42)
	
}

test("Y29uc29sZS5sb2coImZyb20gc2NyaXB0Iik=")