# driver-challenge

## How to run this tool
1. Clone the GIT project into a folder of your choice
2. Run the command `npm install -g`. If it throws error try running the command `sudo npm install -g`
3. This will install the dependencies and install the shebang to the commandline bin (as named in the package.json file - driver-run)
4. Run the command `driver-run <full path of the input file>`
	* Example: `$ driver-run ~/Documents/temp/input1.txt`
5. The tool will start processing and finally outputs a new file `result.txt` in the application's root folder. This file will containt the final output sequence.

## Rules
The tool has been developed considering the following rules
* Two fragments can be matched if and only if they match as a trailing or leading fragments only. Fragments with matching sequences in any other positions are not considered as a match.
* Highest priority is given to the fragments that match > 50%. Priority is given based on the match score, in descending order.
* FASTA algorithm implies that lines in the input text file between two `>`s is considered as a single fragment. 

## Algorithm
* Gather the fragments from the text file into an array.
* Take the first fragment in this array as the Seed Fragment. (It has been observed that the order did not matter. So, I considered that the first fragment I come across will become the seed fragment)
* Take the remaining framgents in the array and create another array - Let us call this a Dynamic Fragment Array. 
	* Seed Fragment will be matched with each fragment in this Dynamic Fragment Array
	* If a match is found based on the above rules, the unmatched part is concatenated to the Seed Fragment. (Either as a Leading or a Trailing fragment). This will become the new Seed Fragment
	* Remove the matched fragment from the Dynamic Fragment Array and re-iterate the process with the new Seed Fragment, until the Dynamic Fragment Array will have no items (or) the Dynamic Fragment Array will have no matching fragments with the final seed fragment.
	* If the Dynamic Fragment Array become completely empty, return the last Seed Fragment as the output of the process.
	* If the Dynamic Fragment Array still has Fragments but are un-matchable (or do not match either as leading or trailing fragments), these will be concatenated to the last seed fragment to finally return the output
* The output returned in this process is the final sequnece desired.
