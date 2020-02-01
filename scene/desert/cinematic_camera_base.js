var isJanusWeb = (typeof elation != 'undefined');

var started = false;
var translate_player_on = false;
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
	
}
function new_curve()
{
	cur_index = (cur_index + 1) % document.curves.length;
	transition_type = document.curves[cur_index][0];
	cur_curve = document.curves[cur_index][1];
	curve_lookat = document.curves[cur_index][2];
	curve_time_length = document.curves[cur_index][3];
	curve_timer = 0.0;
}

room.update = function(dt)
{
	if (isJanusWeb)
	{
		if (document.curves !== 'undefined')
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
					curve_time_length = 0.001;
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
				else if (cur_curve && transition_type == 'end')
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
	player.pos = Vector(point.x, point.y, point.z);
	if (lookat)
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