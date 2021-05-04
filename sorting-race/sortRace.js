//CS335-02 Project 2 Sort Race - Team YZJ
//Authors: 
//	Youssef Chahine	- ykchahine@csu.fullerton.edu
//	Zach Hofmeister	- zachhof@csu.fullerton.edu
//	Jonathan Hana	- hanaj97@csu.fullerton.edu
//File Name: sortRace.js
//File Description: The source code and algorithms of the sortRace program.

var g_canvas = { cell_size:14, wid:74, hgt:48 }; // JS Global var, w canvas size info.
var g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
var g_frame_mod = 3; // Update every 'mod' frames.
var g_stop = 0; // Go by default.

var inputs = ["05CA62A7BC2B6F03","065DE66B71F040BA","0684FB89C3D5754E","07C9A2D18D3E4B65","09F48E7862ED2616","1FAB3D47905FC286","286E1AD0342D7859","30E530BC4786AF21","328DE47C65C10BA9","34F2756FD18E90BA","90BA34F07E56F180","D7859286E2FD0342"];
var g_raceObj = {index:0, currentStr:"", racing:false}

var g_newStrColor = "white";

var g_algoSS = {col:2, lineNum:0, color:"red", str:"", rotation:0, passes:0, unsortedIndex:0}
var g_algoGP = {col:20, lineNum:0, color:"gold", str:"", rotation:0, passes:0, parity:0}
var g_algoMS = {col:38, lineNum:0, color:"deepskyblue", str:"", rotation:0, passes:0, pIndex:0, partitions:[]}
var g_algoQS = {col:56, lineNum:0, color:"magenta", str:"", rotation:0, passes:0, pivot:0, end:15, sIndex:1, pIndex:-1, partitions:[]}

var width;
var height;

function setup() { // P5 setup function
    let sz = g_canvas.cell_size;
    width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1 pixels.
    height = sz * g_canvas.hgt;
    createCanvas(width, height);  // Make a P5 canvas.
	startRace();
}

function draw() { // P5 frame re-draw function, called for every frame.	
    ++g_frame_cnt;
    if (0 == g_frame_cnt % g_frame_mod) {
        if (!g_stop && g_raceObj.racing) raceManager();
    }
}

function startRace() {
	//Reset display
	background("#000"); // set canvas to black
	let sz = g_canvas.cell_size;
	textAlign(LEFT, CENTER);
	textSize(sz);
	fill("#FFF");
	text("Selection Sort", g_canvas.cell_size * g_algoSS.col, 20);
	text("Gold's Pore Sort", g_canvas.cell_size * g_algoGP.col, 20);
	text("Mergesort", g_canvas.cell_size * g_algoMS.col, 20);
	text("Quicksort", g_canvas.cell_size * g_algoQS.col, 20);
	//Update raceObj
	g_raceObj.currentStr = inputs[g_raceObj.index];
	g_raceObj.racing = true;
	//Write string to HTML
	document.getElementById("sortingString").innerHTML = g_raceObj.currentStr;
	//Reset algo objects
	g_algoSS.lineNum = 0;
	g_algoSS.str = g_raceObj.currentStr;
	g_algoSS.rotation = 0;
	g_algoSS.passes = 0;
	g_algoSS.unsortedIndex = 0;

	g_algoGP.lineNum = 0;
	g_algoGP.str = g_raceObj.currentStr;
	g_algoGP.rotation = 0;
	g_algoGP.passes = 0;
	g_algoGP.parity = 0;

	g_algoMS.lineNum = 0;
	g_algoMS.str = g_raceObj.currentStr;
	g_algoMS.rotation = 0;
	g_algoMS.passes = 0;
	g_algoMS.pIndex = 0;
	g_algoMS.partitions = [];

	g_algoQS.lineNum = 0;
	g_algoQS.str = g_raceObj.currentStr;
	g_algoQS.rotation = 0;
	g_algoQS.passes = 0;
	g_algoQS.pivot = 0;
	g_algoQS.end = 15;
	g_algoQS.sIndex = 1;
	g_algoQS.pIndex = -1;
	g_algoQS.partitions = [];
}

function raceManager() {
	//Selection Sort
	if (sorted(g_algoSS.str)) { //End of the current lap
		drawString(g_algoSS, g_algoSS.color);
		g_algoSS.str = rotateString(g_raceObj.currentStr, ++g_algoSS.rotation);
		g_algoSS.unsortedIndex = 0;
	} else if (g_algoSS.rotation < g_raceObj.currentStr.length) { //Not sorted, and race not ended
		drawString(g_algoSS);
		drawIterationNum(g_algoSS);
		selecSortOnce(g_algoSS);
	}
	//Gold's Pore Sort
	if (sorted(g_algoGP.str)) { //End of the current lap
		drawString(g_algoGP, g_algoGP.color);
		g_algoGP.str = rotateString(g_raceObj.currentStr, ++g_algoGP.rotation);
		g_algoGP.parity = 0;
	} else if (g_algoGP.rotation < g_raceObj.currentStr.length) { //Not sorted, and race not ended
		drawString(g_algoGP);
		drawIterationNum(g_algoGP);
		goldsPoreOnce(g_algoGP);
	}
	//Merge Sort
	if (sorted(g_algoMS.str)) { //End of the current lap
		drawString(g_algoMS, g_algoMS.color);
		g_algoMS.str = rotateString(g_raceObj.currentStr, ++g_algoMS.rotation);
		g_algoMS.pIndex = 0;
		g_algoMS.partitions = [];
	} else if (g_algoMS.rotation < g_raceObj.currentStr.length) { //Not sorted, and race not ended
		drawString(g_algoMS);
		drawIterationNum(g_algoMS);
		mergeSortOnce(g_algoMS);
	}
	//Quick Sort
	if (sorted(g_algoQS.str)) { //End of the current lap
		drawString(g_algoQS, g_algoQS.color);
		g_algoQS.str = rotateString(g_raceObj.currentStr, ++g_algoQS.rotation);
		g_algoQS.pivot = 0;
		g_algoQS.end = 15;
		g_algoQS.sIndex = 1;
		g_algoQS.pIndex = -1;
		g_algoQS.partitions = [];
	} else if (g_algoQS.rotation < g_raceObj.currentStr.length) { //Not sorted, and race not ended
		drawString(g_algoQS);
		drawIterationNum(g_algoQS);
		quickSortOnce(g_algoQS);
	}
}

function selecSortOnce(ssObject) { //One pass for the selection sort algorithm
	var min = ssObject.unsortedIndex; //min: index of the minimum unsorted element

	//find the minimum in the unsorted area
	for (let i = min+1; i < ssObject.str.length; ++i) {
		if (parseInt(ssObject.str[i], 16) < parseInt(ssObject.str[min], 16)) {
			min = i;
		}
	}

	swap(ssObject, min, ssObject.unsortedIndex); //Swap minimum element with the first unsorted element
	++ssObject.unsortedIndex; //Increment the index of first unsorted element.
	++ssObject.passes;
}

function goldsPoreOnce(gpObject) { //One pass for the gold's pore sorting algorithm
	if (!sorted(gpObject.str)) {
		for (var i = gpObject.parity; i < gpObject.str.length; i += 2) {
			if (i + 2 > gpObject.str.length) continue;
			if (gpObject.str[i] > gpObject.str[i + 1]) {
				swap(gpObject, i, i + 1);
			}
		}
		
		// Set the next half-pass to be even (0) or odd (1).
		gpObject.parity = (gpObject.parity + 1) % 2;
	}
	++gpObject.passes;
}

function mergeSortOnce(msObject) { //One pass for the merge sort algorithm
	if (!sorted(msObject.str)) {
		if (msObject.partitions.length == 0) {
			// Start off with single element partitions, then start merging and sorting per pass after this pass.
			for (var i = 0; i < msObject.str.length; i++) {
				msObject.partitions.push([msObject.str[i]]);
			}
		}
		
		var partS = ""; // To store (sorted) elements from left + right partitions into a single partition.
		var part = [];
		
		for (var i = msObject.pIndex; i < msObject.partitions.length; i += 2) {
			var mergeS = "";
			var merge = [];
			
			if (i + 1 < msObject.partitions.length) {			
				var lp = msObject.partitions[i]; // left partition
				var rp = msObject.partitions[i + 1]; // right partition
				
				var a = 0;
				var b = 0;
				
				while (a < lp.length && b < rp.length) {
					if (lp[a] < rp[b])
						{ merge.push(lp[a]); mergeS+=lp[a]; a++; }
					else
						{ merge.push(rp[b]); mergeS+=rp[b]; b++; }
				}
				
				var r = a < lp.length ? a : b;
				var rArr = a < lp.length ? lp : rp;
				for (; r < rArr.length; r++) { merge.push(rArr[r]); mergeS+=rArr[r]; }
				
				msObject.pIndex += 2;
			}
			else {
				// A partition left out w/o any other partition to merge with. Occurs when the array length is odd.
				merge.push(msObject.partitions[i][0]);
				mergeS += msObject.partitions[i];
				msObject.pIndex++;
			}
			
			part.push(merge);
			partS += mergeS;
		}
		
		msObject.partitions = msObject.partitions.concat(part);
		msObject.str = partS;
	}
	++msObject.passes;
}

function quickSortOnce(qsObject) { //One pass for the quick sort algorithm
	if (qsObject.str.length > 1 && !sorted(qsObject.str)) {
		// Start after pivot, move onwards until (relative) end reached.
		for (var i = qsObject.pivot + 1; i <= qsObject.end; i++) {
			// If current value is <= pivot value, then swap it with the store index value and increment store index.
			if (qsObject.str[i] <= qsObject.str[qsObject.pivot]) {
				swap(qsObject, i, qsObject.sIndex);
				qsObject.sIndex++;
			}
		}
		// Since store index started with 1, we need to subtract 1 (in case it's out-of-bounds).
		swap(qsObject, qsObject.pivot, qsObject.sIndex - 1);
		
		// Need to set pivot to new position before proceeding, prior to divide-and-conquer.
		qsObject.pivot = qsObject.sIndex - 1;
		
		// Get furthest left side of 1st partition (left of pivot).
		var p1Left = (qsObject.pIndex == -1) ? 0 : qsObject.partitions[qsObject.pIndex].start;
		// Get furthest right side of 2nd partition (right of pivot).
		var p2Right = (qsObject.pIndex == -1) ? 15 : qsObject.partitions[qsObject.pIndex].end;
		
		if (p1Left <= qsObject.pivot - 1) {
			// Create partition to left of pivot.
			qsObject.partitions.push({
				start: p1Left, end: qsObject.pivot - 1
			});
		}
		
		if (p2Right >= qsObject.pivot + 1) {
			// Create partition to right of pivot.
			qsObject.partitions.push({
				start: qsObject.pivot + 1, end: p2Right
			});
		}

		// Increment partition index so that we can work on a partition that hasn't been processed yet.
		qsObject.pIndex++;
		
		// If the partition index < length of partitions array, then we still need to go through unprocessed partitions.
		if (qsObject.pIndex < qsObject.partitions.length) {		
			qsObject.pivot = qsObject.partitions[qsObject.pIndex].start; // Pivot is always at very left side (start) of partition/main array.
			qsObject.end = qsObject.partitions[qsObject.pIndex].end; // Self-explanatory.
			qsObject.sIndex = qsObject.pivot + 1; // Store index is the value after the pivot.
		}
	}
	++qsObject.passes;
}

function replaceChar(str, index, char) {
	return str.substr(0,index) + char + str.substr(index+1);
}

function swap(obj, i, j) { //Swaps the characters at indices i and j
	let oi = obj.str[i];
	obj.str = replaceChar(obj.str, i, obj.str[j]);
	obj.str = replaceChar(obj.str, j, oi);
}

function rotateString(str, offset) { //Rotates a string so that the first characters moves to the back, rest move over.
	offset %= str.length;
	return str.substr(offset) + str.substr(0, offset);
}

function sorted(str) { //Takes a string of hexidecimal characters and returns true if it is in sorted order (L to G)
	let sorted = true;
	for (let i = 0; i < str.length - 1; ++i) {
		if (parseInt(str[i], 16) > parseInt(str[i+1], 16)) {
			sorted = false;
			break;
		}
	}
	return sorted;
}

function drawString(algoObject, overrideColor) {
	// var currentColor = color(random(0, 255), random(0,255), random(0,255));
	// Uncomment the following to display pass number
	// let x = algoObject.col - 1.5;
	// let y = (algoObject.lineNum % (g_canvas.hgt - 2)) + 2; //0 - 62
	// drawCell(x, y, "#000", algoObject.lineNum, "#fff");
	colorMode(HSB, 256, 256, 256);
	for (var i = 0; i < 16; ++i) {
		var cellColor;
		if (typeof overrideColor === "undefined")
			cellColor = color(hue(algoObject.color), parseInt(algoObject.str[i], 16)*12, brightness(algoObject.color));
		else cellColor = overrideColor;

		let x = algoObject.col + i;
		let y = (algoObject.lineNum % (g_canvas.hgt - 2)) + 2; //2-48
		drawCell(x, y, cellColor, algoObject.str[i], "black");
		drawCell(x, y+1, "black", "", "black"); //Black-out the next line, for easier wrap-around visibility
	}
	++algoObject.lineNum;
}

function drawCell(x, y, cellColor, char, charColor) {
	let sz = g_canvas.cell_size;
    let rectX = 1+ x*sz; // Set x one pixel inside the sz-by-sz cell.
    let rectY = 1+ y*sz;

	fill(cellColor);
	rect(rectX, rectY, sz, sz);
	
	textAlign(CENTER, CENTER);
	fill(charColor);
	text(char, rectX + (sz / 2), rectY + (sz / 2) + 2);
}

function drawIterationNum(algoObject) {
	let sz = g_canvas.cell_size;
	fill("black");
	rect(sz * (algoObject.col + 12), 0, 4*sz, 2*sz);
	textAlign(RIGHT, CENTER);
	fill("white");
	text(algoObject.passes, sz * (algoObject.col + 16), 20);
}

function keyPressed() {
	// console.log(`keyPressed: ${keyCode}`);
	switch(keyCode) {
		case 32: //Spacebar
			g_stop = !g_stop; //Pause
			break;
		case 37:{ //Left Arrow
			let len = inputs.length;
			g_raceObj.index = (((g_raceObj.index - 1) % len) + len) % len; //decrement race index
			startRace();
			break;
		}
		case 39: { //Right Arrow
			let len = inputs.length;
			g_raceObj.index = (((g_raceObj.index + 1) % len) + len) % len; //increment race index
			startRace();
			break;
		}
	}
}