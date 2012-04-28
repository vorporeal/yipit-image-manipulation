var imgObj;
var selection = new Selection(0,0,0,0);
var mouse_clicked = false;
var lastMouseX;
var lastMouseY;

$(document).ready(function(){
	var canvas = $('#mainCanvas')[0];
	canvas.addEventListener('mousemove', mouseDrag);
	canvas.addEventListener('mouseup', mouseUp);
	canvas.addEventListener('mousedown', mouseDown);
	canvas.addEventListener('mouseout', mouseUp);
	canvas.draggable = false;
});


function Selection(x,y,w,h)
{
	this.X;
	this.Y;
	this.rightX;
	this.botY;
	this.width;
	this.height;
	this.clicked = 0;
	//0 - nothing
	//1 - top left
	//2 - top right
	//3 - bottom left
	//4 - bottom right
	//5 - drag whole box
	this.size = 15;
	this.origX;
	this.origY;
	this.origWidth;
	this.origHeight;
	this.lastSelectionX;
	this.lastSelectionY;
	this.lastWidth;
	this.lastHeight;
}

Selection.prototype.draw = function()
{
	var ctx = $('#mainCanvas')[0].getContext('2d');
	var c_width = $('#mainCanvas')[0].width;
	var c_height = $('#mainCanvas')[0].height;
	ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
	ctx.fillRect(0,0,c_width,Math.floor(selection.Y));
	ctx.fillRect(selection.X+selection.width, Math.floor(selection.Y), c_width-selection.X-selection.width, Math.ceil(selection.height));	
	ctx.fillRect(0, Math.floor(selection.Y), selection.X, Math.ceil(selection.height));
	ctx.fillRect(0, Math.floor(selection.Y)+Math.ceil(selection.height), c_width, c_height-Math.floor(selection.Y)-Math.ceil(selection.height));
	ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
	ctx.fillRect(selection.X, selection.Y, this.size, this.size);
	ctx.fillRect(selection.X+selection.width-this.size, selection.Y, this.size, this.size);
	ctx.fillRect(selection.X, selection.Y+selection.height-this.size, this.size, this.size);
	ctx.fillRect(selection.X+selection.width-this.size, selection.Y+selection.height-this.size, this.size, this.size);
	ctx.strokeStyle = "rgba(0, 0, 0, 1.0)";
	ctx.lineWidth = 0.5;
	ctx.strokeRect(selection.X, selection.Y, this.size, this.size);
	ctx.strokeRect(selection.X+selection.width-this.size, selection.Y, this.size, this.size);
	ctx.strokeRect(selection.X, selection.Y+selection.height-this.size, this.size, this.size);
	ctx.strokeRect(selection.X+selection.width-this.size, selection.Y+selection.height-this.size, this.size, this.size);
	ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
	switch(this.clicked)
	{
		case 1:
			ctx.fillRect(selection.X, selection.Y, this.size, this.size);
		break;
		case 2:
			ctx.fillRect(selection.X+selection.width-this.size, selection.Y, this.size, this.size);
		break;
		case 3:
			ctx.fillRect(selection.X, selection.Y+selection.height-this.size, this.size, this.size);
		break;
		case 4:
			ctx.fillRect(selection.X+selection.width-this.size, selection.Y+selection.height-this.size, this.size, this.size);
		break;
		default:
	}
	
}

function updateSelection()
{
	var scaleX = imgObj.width/$('#mainCanvas')[0].width;
	var scaleY = imgObj.height/$('#mainCanvas')[0].height;
	selection.origX = selection.X*scaleX;
	selection.origY = selection.Y*scaleY;
	selection.origWidth = selection.width*scaleX;
	selection.origHeight = selection.height*scaleY;
}

function fillSelectionForm()
{
	$('#selectX')[0].value= Math.floor(selection.X);
	$('#selectY')[0].value = Math.floor(selection.Y);
	$('#selectWidth')[0].value = Math.floor(selection.width);
	$('#selectHeight')[0].value = Math.floor(selection.height);	
}

//calls updateSelection
//updates thumbnail
function updateThumbnail()
{
	var thumb_dimension = 100;
	var thumbnail_style = $('#thumbnail');
	updateSelection();
	//should be the same
	var X_scale = thumb_dimension/selection.origWidth;
	var Y_scale = thumb_dimension/selection.origHeight;
	thumbnail_style.css('width', imgObj.width*X_scale);
	thumbnail_style.css('height', imgObj.height*Y_scale);
	thumbnail_style.css('left', -selection.origX*X_scale);
	thumbnail_style.css('top', -selection.origY*Y_scale);
}

function edit_mode()
{
	if (imgObj != undefined && imgObj.complete)
	{
		$('#editDiv').animate({height: '200px'}, {duration: 500, queue:false});
		$('#previewDiv').animate({height: '0px'}, {duration: 500, queue:false});
	}
}

function preview_mode()
{ 
	$('#editDiv').animate({height: '0px'}, {duration: 500, queue:false});
	$('#previewDiv').animate({height: '150px'}, {duration: 500, queue:false});
	updateThumbnail();
}

function updateCanvas()
{
	var ctx = $('#mainCanvas')[0].getContext('2d');
	var c_width = $('#mainCanvas')[0].width;
	var c_height = $('#mainCanvas')[0].height;
	ctx.drawImage(imgObj, 0,0, c_width, c_height); 
	selection.draw();
	fillSelectionForm();
}

function load_pic()
{
	var path = $('#path')[0].value;
	var thumbnail = $('#thumbnail')[0];
	var full = $('#full')[0];
	var full_style = $('#full');
	var thumb_dimension = 100;
	
	imgObj = new Image();
	imgObj.onload = function()
	{
		var original_width = imgObj.width;
		var original_height = imgObj.height;
		//Deal with preview mode
		full.src = path;
		full_style.css('height', thumb_dimension);
		full_style.css('width', (full.height/original_height)*original_width);
		
		//Deal with edit mode
		var c_height = $('#mainCanvas')[0].height;
		var c_width = c_height/imgObj.height*imgObj.width;
		$('#mainCanvas')[0].width = Math.floor(c_width);
		
		//set selection
		if (c_width > c_height)
		{
			selection.height = c_height;
			selection.Y = 0;
			selection.width = c_height;
			selection.X = (c_width-c_height)/2.0;
		}
		else
		{
			selection.width = c_width;
			selection.X = 0;
			selection.height = c_width;
			selection.Y = (c_height-c_width)/2.0
		}
		selection.rightX = selection.X + selection.width;
		selection.botY = selection.Y + selection.height;
		thumbnail.src = path;
		updateThumbnail();
		updateCanvas();
	}
	imgObj.src = path;
}

function mouseDown(e)
{
	mouse_clicked = true;
	var mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
	lastMouseX = mouseX;
	lastMouseY = mouseY;
	selection.lastSelectionX = selection.X;
	selection.lastSelectionY = selection.Y;
	selection.lastWidth = selection.width;
	selection.lastHeight = selection.height;
	if (mouseX >= selection.X && mouseX <selection.X+selection.width
		&& mouseY >= selection.Y && mouseY < selection.Y+selection.height)
	{
		var sum = 0;
		if (mouseX < selection.X+selection.size)
		{
			sum+=1;
		}
		else if (mouseX >= selection.X+selection.width-selection.size)
		{
			sum+=2;
		}
		
		if (mouseY < selection.Y+selection.size)
		{
			sum+=4;
		}
		else if (mouseY >= selection.Y+selection.height-selection.size)
		{
			sum+=7;
		}
		
		switch(sum)
		{
		case 5:
			selection.clicked = 1;
			$('#mainCanvas').css('cursor', 'se-resize');
		break;
		case 6:
			selection.clicked = 2;
			$('#mainCanvas').css('cursor', 'ne-resize');
		break;
		case 8:
			selection.clicked = 3;
			$('#mainCanvas').css('cursor', 'ne-resize');
		break;
		case 9:
			selection.clicked = 4;
			$('#mainCanvas').css('cursor', 'se-resize');
		break;
		default:
			selection.clicked = 5;
			$('#mainCanvas').css('cursor', 'move');
		}
	}
	updateCanvas();
}

function mouseUp(e)
{
	selection.clicked = 0;
	mouse_clicked = false;
	$('#mainCanvas').css('cursor', 'default');
	updateCanvas();
}


function mouseDrag(e)
{
	var mouseX, mouseY;
	var canvas = $('#mainCanvas')[0];
    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
	if (mouse_clicked){
		var changeX = mouseX - lastMouseX;
		var changeY = mouseY - lastMouseY;
		var shortest = Math.min(Math.abs(changeX), Math.abs(changeY));
		if (changeX < 0)
			var shiftX = -shortest;
		else
			var shiftX = shortest;
		
		if (changeY < 0)
			var shiftY = -shortest;
		else
			var shiftY = shortest;
		
		switch(selection.clicked)
		{
			case 1:
				if ((changeX < 0 && changeY < 0) || (changeX > 0 && changeY > 0))
				{
					selection.X = selection.lastSelectionX + shiftX;
					selection.Y = selection.lastSelectionY + shiftY;
					selection.width = selection.lastWidth - shiftX;
					selection.height = selection.lastHeight - shiftY;	
					if (selection.X  < 0)
					{
						selection.X = 0;
						selection.width = selection.rightX;
						selection.height = selection.width;
						selection.Y = selection.botY-selection.height;
					}
					else if (selection.X+selection.size*2 > selection.rightX)
					{
						selection.X = selection.rightX - selection.size*2;
						selection.width = selection.size*2;
						selection.height = selection.width;
						selection.Y = selection.botY-selection.size*2;
					}
					if (selection.Y < 0)
					{
						selection.Y = 0
						selection.height = selection.botY;
						selection.width = selection.height;
						selection.X = selection.rightX-selection.width;
					}
					else if (selection.Y+selection.size*2 > selection.botY)
					{
						selection.Y = selection.botY - selection.size*2;
						selection.height = selection.size*2;
						selection.width = selection.height;
						selection.X = selection.rightX - selection.size*2;
					}
					
				}
			break;
			case 2:
				if ((changeX > 0 && changeY < 0) || (changeX < 0 && changeY > 0))
				{
					selection.Y = selection.lastSelectionY + shiftY;
					selection.width = selection.lastWidth + shiftX;
					selection.height = selection.lastHeight - shiftY;
					if (selection.X + selection.width >= canvas.width)
					{
						selection.width = canvas.width-selection.X;
						selection.height = selection.width;
						selection.Y = selection.botY - selection.height;
					}
					else if (selection.X > selection.rightX-selection.size*2)//change X here
					{
						selection.width = selection.size*2;
						selection.height = selection.width;
						selection.Y = selection.botY - selection.size*2;
					}
					if (selection.Y < 0)
					{
						selection.Y = 0
						selection.height = selection.botY;
						selection.width = selection.height;
						selection.X = selection.rightX-selection.width;
					}
					else if (selection.Y > selection.botY-selection.size*2)
					{
						selection.width = selection.size*2;
						selection.height = selection.width;
						selection.Y = selection.botY - selection.size*2;
					}
				}
			break;
			case 3:
				if ((changeX > 0 && changeY < 0) || (changeX < 0 && changeY > 0))
				{
					selection.X = selection.lastSelectionX + shiftX;
					selection.width = selection.lastWidth - shiftX;
					selection.height = selection.lastHeight + shiftY;
					if (selection.X < 0)
					{
						selection.X = 0;
						selection.width = selection.rightX;
						selection.height = selection.width;
						selection.Y = selection.botY-selection.height;
					}
					else if (selection.X > selection.rightX-selection.size*2)
					{
						selection.X = selection.rightX-selection.size*2;
						selection.width = selection.size*2;
						selection.height = selection.width;
					}
					selection.botY = selection.Y + selection.height;
					if (selection.Y + selection.height >= canvas.height)
					{
						selection.height = canvas.height-selection.Y;
						selection.width = selection.height;
						selection.X = selection.rightX-selection.width;
					}
					else if (selection.Y > selection.botY-selection.size*2)//fix Y
					{
						selection.height = selection.size*2;
						selection.width = selection.height;
						selection.X = selection.rightX-selection.size*2;
					}
				}
			break;
			case 4:
				if ((changeX < 0 && changeY < 0) || (changeX > 0 && changeY > 0))
				{
					selection.width = selection.lastWidth + shiftX;
					selection.height = selection.lastHeight + shiftY;
					selection.botY = selection.Y + selection.height;
					selection.rightX = selection.X + selection.width;
					if (selection.X + selection.width >= canvas.width)
					{
						selection.width = canvas.width-selection.X;
						selection.height = selection.width;
					}
					else if (selection.X > selection.rightX-selection.size*2)//wrong conditioin, check from bottom
					{
						selection.width = selection.size*2;
						selection.height = selection.width;
					}
					if (selection.Y + selection.height >= canvas.height)
					{
						selection.height = canvas.height-selection.Y;
						selection.width = selection.height;
					}
					else if (selection.Y > selection.botY-selection.size*2)//wrong conditioin, check from bottom
					{
						selection.width = selection.size*2;
						selection.height = selection.width;
					}
				}
			break;
			case 5:
				var newX = selection.lastSelectionX + changeX;
				var newY = selection.lastSelectionY + changeY;
				if (newX+Math.floor(selection.width) > canvas.width)
				{
					selection.X = canvas.width-Math.floor(selection.width);
				}
				else if (newX < 0)
				{
					selection.X = 0;
				}
				else if ( newX >= 0 && selection.width <= canvas.width)
				{
					selection.X = newX;	
				}
				
				if (newY+Math.floor(selection.height) > canvas.height)
				{
					selection.Y = canvas.height-Math.floor(selection.height);
				}
				else if (newY < 0)
				{
					selection.Y = 0;
				}
				else if (newY >= 0 && newY+Math.floor(selection.height) <= canvas.height)
				{
					selection.Y = newY;
				}
			break;
			default:
		}
		selection.botY = selection.Y + selection.height;
		selection.rightX = selection.X + selection.width;
		if (selection.clicked != 0)
		{
			updateCanvas();
		}
	}
}


function send_info()
{
	$('#submitCrop').submit();
}

