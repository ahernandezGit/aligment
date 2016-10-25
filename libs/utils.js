function drawCorrespondences(){
    var n=Math.min(landmarkData1.length,landmarkData2.length);
    var thesame=false;
    var correspondences=setup.scene.getObjectByName("Correspondences");
    if(correspondences!=undefined){
        setup.scene.remove(correspondences);
        dispose3(correspondences);
    }
    else if(n>0){
        var geo=new THREE.Geometry();
        var geop = new THREE.CircleGeometry(0.2, 16);
        var groupCircles=new THREE.Object3D();
        var materialp = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide } );
        for(var i=0;i<n;i++){
            geo.vertices.push(landmarkData1[i],landmarkData2[i]);
            var circle = new THREE.Mesh( geop, materialp );
            var circle1=circle.clone();
            var circle2=circle.clone();
            circle1.position.set(landmarkData1[i].x,landmarkData1[i].y,0);
            circle2.position.set(landmarkData2[i].x,landmarkData2[i].y,0);
            groupCircles.add(circle1,circle2);
        }
        correspondences=new THREE.LineSegments(geo,correspondencesmaterial);
        correspondences.name="Correspondences";
        correspondences.geometry.computeLineDistances();
        correspondences.geometry.lineDistancesNeedUpdate=true;
        correspondences.add(groupCircles);
        setup.scene.add(correspondences);
        //setup.scene.add(groupCircles);
    }
}