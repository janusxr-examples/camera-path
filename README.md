# camera-path

Camera paths in JanusWeb using spline curves and target objects

Hit U to make a new point, P to jump off the path, and L to change the tracked object.

Then, open web console and search for new THREE.Vector3 and copy all those points to a notepad. These are the spline curve points that will go into the js file for your custom camera path. Next, search for Tracking Box in the console to grab the vector points of where you placed the point of focus object (L to place).

It's a good idea to keep the base script and the custom spline points separate.


