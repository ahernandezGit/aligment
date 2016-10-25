function onMouseDown(){
    event=d3.event;
    if(isCurve1 || isCurve2){
        setup.scene.add(LineStroke);
        LastPoint=mousePosition3D(event);
        isDrawing = true;
        if(isCurve1){
            if(Line1.geometry.vertices.length>0) {
                setup.scene.remove(Line1);
                dispose3(Line1);
                points1=[];
            }
            points1.push(LastPoint);      
        }
        if(isCurve2){
            if(Line2.geometry.vertices.length>0) {
                setup.scene.remove(Line2);
                dispose3(Line2);
                points2=[];
            }
            points2.push(LastPoint);      
        }
    }
    if(landmark){
        if(intersectedCurve=="Line1"){
            landmarkData1.push(pointGeometry.vertices[0].clone());
        }
        if(intersectedCurve=="Line2"){
            landmarkData2.push(pointGeometry.vertices[0].clone());
        }
        drawCorrespondences();
    }
}
function onMouseMove(){
    event=d3.event;
    if(isCurve1 || isCurve2){
        if (!isDrawing) return;
        CurrentPoint=mousePosition3D(event);
        var geometryLine = new THREE.Geometry();
        geometryLine.vertices.push(LastPoint,CurrentPoint);
        if(isCurve1){    
            points1.push(CurrentPoint);
            var line = new THREE.Line( geometryLine, material1 );
        }
        if(isCurve2){    
            points2.push(CurrentPoint);
            var line = new THREE.Line( geometryLine, material2 );
        }
        LineStroke.add(line);
        LastPoint=CurrentPoint;
    }
    if(landmark){
        var mouse= mouseNDCXY(event);
        raycasterCurve.setFromCamera( mouse, setup.camera );
        var intersects = raycasterCurve.intersectObjects([Line1,Line2]);
        if ( intersects.length > 0 ) {
            var intersected=intersects[0]; 
            if(intersected.object.name=="Line1"){
                intersectedCurve="Line1";
            }
            if(intersected.object.name=="Line2"){
                intersectedCurve="Line2";
            }
            var validator=(intersected.object.name=="Line1" && (landmarkData1.length<=landmarkData2.length))
            validator=validator||(intersected.object.name=="Line2" && (landmarkData2.length<landmarkData1.length))
            if(validator){
                var index= intersected.index;
                pointGeometry.vertices[0].copy(intersected.object.geometry.vertices[index]);
                pointGeometry.verticesNeedUpdate=true;
                var pintersection=setup.scene.getObjectByName("intersectPoint"); 
                if(pintersection!=undefined){
                    setup.scene.remove( pintersection );
                    dispose3(pintersection);
                }
                pintersection = new THREE.Points( pointGeometry, pointmaterial );
                pintersection.name="intersectPoint";
                setup.scene.add(pintersection);   
            }    
        }
        
    }
}
function onMouseUp(){
    if(isCurve1 || isCurve2){
        setup.scene.remove( LineStroke );
        dispose3(LineStroke);
        LineStroke = new THREE.Object3D();
        isDrawing = false;
        var geo=new THREE.Geometry();
        if(isCurve1){
            geo.vertices=points1;
            geo.vertices.push(points1[0]);
            Line1=new THREE.Line(geo,material1);
            Line1.name="Line1";
            setup.scene.add(Line1);
        }
        if(isCurve2){
            geo.vertices=points2;
            geo.vertices.push(points2[0]);
            Line2=new THREE.Line(geo,material2);
            Line2.name="Line2";
            setup.scene.add(Line2);
        }
    }   
}
function onKeyDown(){
    var event=d3.event;
    //letter esc
    if(event.keyCode == 27){
        setup.controls.enabled=!setup.controls.enabled;
        isCurve1=false;
        isCurve1=false;
        landmark=false;
    }
}

