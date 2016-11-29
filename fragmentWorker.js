var stringwork = require('./stringwork');

module.exports = {
	processFragments : function (seedFragment, dynFragmentArray){
		// Now we have the seed fragment
		// Also the dynamic array.
		// Get sort order of the dynamicArray
		// This is the order which we are going to use for comparison
		var unsortedDynArray = [];
		
		for(var i = 0, len = dynFragmentArray.length; i < len; i++){
			var curMatchScore = stringwork.longestCommonSubstring(seedFragment, dynFragmentArray[i]);
			var tempObj = {key: i, value: curMatchScore};
			unsortedDynArray.push(tempObj);
		}
	
		var sorted = unsortedDynArray.slice(0).sort(function(a, b) {
		   return  b.value - a.value;
		});

		var keys = [];
		for (var i = 0, len = sorted.length; i < len; ++i) {
		    keys[i] = sorted[i].key;
		}

		

		// Now, we have to use each key, get its index from dynFragmentArray
		// See if the seedFragment ends with the value or starts with one
		for(var i = 0; i < keys.length; i++){
			var longestMatchIndex = stringwork.longestCommonSubstring(seedFragment, dynFragmentArray[keys[i]]);
			var isLeadingFragment = false;
			var isTrailingFragment = seedFragment.endsWith(dynFragmentArray[keys[i]].substr( 0, longestMatchIndex));
			if(!isTrailingFragment){
				isLeadingFragment = seedFragment.startsWith(dynFragmentArray[keys[i]].substr( dynFragmentArray[keys[i]].length - longestMatchIndex , dynFragmentArray[keys[i]].length));
			}

			// If the fragment is either trailing or leading fragment, remove that fragment out of the dynFragmentArray
			// Change the seedFragment to merge the matched fragment
			var unmatchedPart = ''
			if(isTrailingFragment){
				unmatchedPart = dynFragmentArray[keys[i]].substr(longestMatchIndex, dynFragmentArray[keys[i]].length);
				seedFragment = seedFragment + unmatchedPart;
				dynFragmentArray.splice(keys[i], 1);
				break;

			} else if(isLeadingFragment){
				unmatchedPart = dynFragmentArray[keys[i]].substr(0, longestMatchIndex);
				seedFragment = unmatchedPart + seedFragment;
				dynFragmentArray.splice(keys[i], 1);
				break;
			} else {
				if(i == keys.length -1){
					// Tried all. No matches found! Just merge all the fragments and exit
					for(var dynI = 0; dynI < dynFragmentArray.length; dynI ++){
						seedFragment = seedFragment + dynFragmentArray[dynI];
					}
					dynFragmentArray.length = 0;
					break;
				}
				// It was not a match at both trailing and leading part
				// so, go to the next fragment in line
			}
		}

		if(dynFragmentArray.length > 0){
			this.processFragments(seedFragment, dynFragmentArray);
		} else {
			returnFragment = seedFragment;
		}

		return returnFragment;
	}

}