var isJanusWeb = (typeof elation != 'undefined');

room.update = function()
{
	if (document.curves !== 'undefined' && isJanusWeb)
	{
		if (document.curves.length == 0)
		{
			document.curves.push([ 'point', new THREE.CatmullRomCurve3
				([
					new THREE.Vector3(7.121071427457921, 10.555931347398166, 9.295370666008052),
					new THREE.Vector3(2.2010479064077386, 10.555931347397882, 1.414731266404966),
				]),
				Vector(-3.861154604276246, 9.631460172739159, 12.203220397901207), 20 
			]);
			
			document.curves.push([ 'point', new THREE.CatmullRomCurve3
				([
					new THREE.Vector3(6.391326108139645, 4.408573217583163, -2.270825729697899),
					new THREE.Vector3(3.755404700471101, 8.28128907243737, -12.618625252067226),
					new THREE.Vector3(17.816146991976773, 7.0867953424161945, -16.993796665066977),
				]),
				Vector(10.17535148467771, 3.106132843655053, -12.397996611117666), 30 
			]);
			
			document.curves.push([ 'point', new THREE.CatmullRomCurve3
			([
				new THREE.Vector3(3.58, 1.35, -27.44),
				new THREE.Vector3(-2.49, 7.60, -31.37),
				new THREE.Vector3(-14.60, 15.30, -24.52),
				]),
				Vector(-5.621472433786081, 15.391807462473926, 18.71064969928776), 40
			]);
			
			document.curves.push([ 'end', Vector(0, 8.5, 0), Vector(0, 0, 1), 1.0 ]);
		}
	}
}