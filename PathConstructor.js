var isJanusWeb = (typeof elation != 'undefined');

var started = false;
var translate_player_on = false;
var translate_box_on = false;
var end_box_on = false;
var cur_index = -1;
var cur_curve = null;
var curve_timer = 0.0;
var curve_time_length = 1.0;
var curve_lookat = null;
var transition_type = null;
var orig_gravity = null;
room.onLoad = function()
{
	if (isJanusWeb)
	{
		document.curves = [];
	}
	// curve = [ transition_type, points, lookat_vector, time_length ];
	// transition_type = 'point' or 'end'
	
	/*
	example script to add waypoints can be found at 
	https://vesta.janusvr.com/files/Spyduck/assets/deserttown/desert_town_camera.js
	you should include them as a separate file, linking to both, if possible
	*/
	
	for (var i = 0; i < 61; i++) 
	{
        room.createObject("Object",{id: "cube", js_id: "spinepointvisual" + i, pos:Vector(0,0,0), scale:Vector(0.2, 0.2, 0.2), col:Vector(1,0,0)});
    }
	
}
function new_curve()
{
	cur_index = (cur_index + 1) % document.curves.length;
	transition_type = document.curves[cur_index][0];
	cur_curve = document.curves[cur_index][1];
	curve_lookat = room.objects["Tracking_Box"].pos;
	curve_time_length = room.objects["Tracking_Box"].col.y * 200 + 0.001;
	curve_timer = 0.0;
}


var pathcurve = new THREE.CatmullRomCurve3
				([
					//new THREE.Vector3(room.objects["Spine_Point0"].pos.x, room.objects["Spine_Point0"].pos.y, room.objects["Spine_Point0"].pos.z),
					//new THREE.Vector3(room.objects["Spine_Point1"].pos.x, room.objects["Spine_Point1"].pos.y, room.objects["Spine_Point1"].pos.z),
					//new THREE.Vector3(room.objects["Spine_Point2"].pos.x, room.objects["Spine_Point2"].pos.y, room.objects["Spine_Point2"].pos.z),
					//new THREE.Vector3(room.objects["Spine_Point3"].pos.x, room.objects["Spine_Point3"].pos.y, room.objects["Spine_Point3"].pos.z),
				]);
				
					
var playeronpathtrigger = 0;			
room.onKeyUp = function(event) 
{
   
    if (event.keyCode == 'U')
    {
		pathcurve.points.push(new THREE.Vector3(player.pos.x, player.pos.y, player.pos.z));
		pathcurve.tension = 0.99;	
		pathcurve.needsUpdate = true;
		console.log("new THREE.Vector3(" + player.pos.x + "," + player.pos.y + "'" + player.pos.z + "),");

    }
    
    if (event.keyCode == 'L')
    {
        room.objects["Tracking_Box"].pos = player.pos;
        console.log("Tracking box at" + player.pos.x + "," + player.pos.y + "'" + player.pos.z + "),");

    }
	
	if (event.keyCode == 'P')
    {
		
		
		
		playeronpathtrigger++;
		if(playeronpathtrigger%2 == 1)
		{
			translate_box_on = true;
			
			for (var i = 0; i < 60; i++) {
			var splinevisualjsid = "spinepointvisual" + i;
			room.objects[splinevisualjsid].visible = true;
		}
		}
		if(playeronpathtrigger%2 == 0)
		{
			translate_box_on = false;
			
			for (var i = 0; i < 60; i++) 
			{
				var splinevisualjsid = "spinepointvisual" + i;
				room.objects[splinevisualjsid].visible = false;
			}
		}
	
    }
}



room.update = function(dt)
{
	
	//var relativepos = player.worldToLocal(V(room.objects["Tracking_Box"].pos.x, room.objects["Tracking_Box"].pos.y, room.objects["Tracking_Box"].pos.z));
	//console.log(relativepos);
	
	var splinePoints = pathcurve.getPoints(60);
	
	for (var i = 0; i < splinePoints.length; i++) {
		var splinevisualjsid = "spinepointvisual" + i;
        room.objects[splinevisualjsid].pos = Vector(splinePoints[i]);
    }
	
	if (document.curves !== 'undefined' && isJanusWeb)
	{
		if (document.curves.length == 0)
		{
			
			
			document.curves.push([ 'point', pathcurve,
				Vector(room.objects["Tracking_Box"].pos.x, room.objects["Tracking_Box"].pos.y, room.objects["Tracking_Box"].pos.z), 10 
			]);
			document.curves.push([ 'end', Vector(room.objects["End_Box"].pos.x, room.objects["End_Box"].pos.y, room.objects["End_Box"].pos.z), Vector(0, 0, 1), 1.0 ]);
		}
	}
	
	
	if(room.objects["Pathing_Box"].pos != null && isJanusWeb || playeronpathtrigger%2 == 1)
	{
		end_box_on = true;
	}
	
	
	if (document.curves !== 'undefined' && isJanusWeb)
	{
		if (still_loading() == false && started == false)
		{
			enable_translate_player();
			started = true;
		}
		
		if (translate_player_on && document.curves.length > 0)
		{
			if (curve_time_length <= 0)
			{
				curve_time_length = room.objects["Tracking_Box"].col.y * 100 + 0.001;
			}
			curve_timer = (curve_timer + (dt * 0.001) / curve_time_length);
			if (cur_curve && transition_type == 'point')
			{
				if (orig_gravity == null)
				{
					orig_gravity = room.gravity;
					room.gravity = 0;
				}
				if (curve_timer < 0 || curve_timer > 1)
				{
					// go to next curve here
					new_curve();
				}
				else
				{
					curve_point = translate_player(curve_timer, cur_curve, curve_lookat);
				}
			}
			else if (cur_curve && transition_type == 'end' && !(end_box_on))
			{
				// disable animation and place player at cur_curve (now a Vector) facing curve_lookat
				player.pos = cur_curve;
				turn_toward_vector(curve_lookat);
				disable_translate_player();
				cur_index = 0;
				if (orig_gravity != null)
				{
					room.gravity = orig_gravity;
				}
			}
			else
			{
				new_curve();
			}
		}
	}
}

function enable_translate_player()
{
	translate_player_on = true;
}
function disable_translate_player()
{
	translate_player_on = false;
}
function log_player_pos() // convenience function to print the player position from console, use to create waypoints quicker
{
	return Number.parseFloat(player.pos.x).toFixed(2)+', '+Number.parseFloat(player.pos.y).toFixed(2)+', '+Number.parseFloat(player.pos.z).toFixed(2);
}
function translate_player(position, curve, lookat)
{
	var point = curve.getPointAt(position);
	if(!(translate_box_on))
	{
		player.pos = Vector(point.x, point.y, point.z);
	}
	if(translate_box_on)
	{
		room.objects["Pathing_Box"].pos = Vector(point.x, point.y, point.z);
	}
	if (lookat && !(translate_box_on))
	{
		turn_toward_vector(lookat);
	}
}
function turn_toward_vector(vec)
{
	// self.walk_direction = math.atan2(float(new_fwd[2]),float(new_fwd[0]))
	var angle = Math.atan2(vec.z-player.pos.z, vec.x-player.pos.x);
	turn_player_toward_radian(-angle);
}
function turn_player_toward_radian(rad)
{
	player.properties.orientation.setFromEuler(new THREE.Euler(0,rad-THREE.Math.DEG2RAD*90,0));
	player.head.properties.orientation.setFromEuler(new THREE.Euler(0,0,0));
}
function still_loading()
{
	var waiting_assets = 0;
	for (asset_name in janus.currentroom.pendingassets)
	{
		var asset = janus.currentroom.pendingassets[asset_name];
		if (asset['assettype'] == 'model' || asset['assettype'] == 'image' || asset['assettype'] == 'video')
		{
			waiting_assets += 1;
		}
	}
	if (waiting_assets > 0)
	{
		return true;
	}
	if (janus.currentroom.loaded == false)
	{
		return true;
	}
	return false;
	
}