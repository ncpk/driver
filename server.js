#!/usr/bin/env node

var co = require('co');
var prompt = require('co-prompt');
var fs = require('fs');
var program = require('commander');
var lineReader = require('line-reader');
var stringwork = require('./stringwork');
var fragmentWorker = require('./fragmentWorker');

console.time('Processing Time');
console.log('Processing the files...');

program
	.arguments('<file>')
	.action(function(file){
		co(function *(){
			
			var fragmentsArray = [];
			var tempFragment='';
			var seedFragment = '';
			lineReader.eachLine(file, function(line, last) {
			  // If line starts with > then skip
			  if(line.indexOf('>') > -1){
			  	// This is the header line. 
			  	// From next line, to the next header line, it is one fragment
			  	if (tempFragment.length > 0){
			  		fragmentsArray.push(tempFragment);
			  		tempFragment = '';
			  	}
			  } else {
			  	tempFragment = tempFragment + line;

			  }
			  
			  if (last) {
			  		fragmentsArray.push(tempFragment);
			  		tempFragment = '';
			  	
			  		// Now, we have all the fragments in an array.
					// Take the first one, call it the seed
					// Take the remaining fragments and add them as items in dynFragmentArray
					// remove the first fragment from the fragmentsArray
					var dynFragmentArray = [];
					

				    // Now, we have all the fragments in an array.
					// Take the first one, call it the seed
					// Take the remaining fragments and add them as items in dynFragmentArray
					// remove the first fragment from the fragmentsArray
					var dynFragmentArray = [];
					
					for (var i = 0, len = fragmentsArray.length; i < len; i++) {
					  if(i == 0){
							seedFragment = fragmentsArray[i];
						} else {
							dynFragmentArray.push(fragmentsArray[i]);
						}
					}

					fragmentsArray.splice(0, 1);
					var newObjs = '';

					newObjs = fragmentWorker.processFragments(seedFragment, dynFragmentArray);
					fs.writeFile('result.txt', newObjs, function (err) {
				        if (err) throw err;
				        console.timeEnd('Processing Time');
				        console.log('Written output to result.txt in the root application folder!');
				    });



			    	return false; // stop reading
			  	}	
			});

		});
	})
	.parse(process.argv);