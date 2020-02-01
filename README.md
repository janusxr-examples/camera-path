# camera-path

Camera paths in JanusWeb using spline curves and target objects. Try the demos below!

<a href="https://janusvr-examples.github.io/camera-path/">
  <img alt="default" target="_blank" src="https://i.imgur.com/9RoiI7R.jpg" height="190" width="32%">
</a>
<a href="https://janusvr-examples.github.io/camera-path/scenes/desert/">
  <img alt="desert" target="_blank" src="https://i.imgur.com/EOK0fe4.jpg" height="190" width="32%">
</a>
<a href="https://janusvr-examples.github.io/camera-path/scenes/trailer/">
  <img alt="trailer" target="_blank" src="https://i.imgur.com/7dAsOCA.jpg" height="190" width="32%">
</a>

- **U** to make a new point
- **L** to change the tracked object
- **P** to jump off the path

Open a web console and filter for for `THREE.Vector3` and copy all those points to a notepad. These are the spline curve points that will go into the js file for your custom camera path. Next, search for Tracking Box in the console to grab the vector points of where you placed the point of focus object (L to place).

```html
<FireBoxRoom>
 <Assets>
  <AssetScript src="PathConstructor.js"/>
 </Assets>
 <Room use_local_asset="room_plane" visible="true" zdir="0 0 -1" >
  <Object col="0 0.1 0" collision_id="cube" id="cube" js_id="Tracking_Box" pos="0 1 10" scale="0.2 0.2 0.2"/>  Change Y color to adjust
 speed, lower is faster
  <Object col="#00ff00" collision_id="cube" id="cube" js_id="End_Box" pos="2 3 60" scale="0.2 0.2 0.2"/>
  <Object col="#00ff00" collision_id="cube" id="cube" js_id="Pathing_Box" pos="0 1 7"/>
 </Room>
</FireBoxRoom>

```

**Tips**

- Change Y color of `Tracking_Box` to adjust speed, lower is faster.
- Delete `Pathing_Box` if you hardcode a path, and want it to end.
- It's a good idea to keep the base script and the custom spline points separate.
