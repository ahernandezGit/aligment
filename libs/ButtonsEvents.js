function clear(){
  
    for (var i = setup.scene.children.length - 1; i >= 0 ; i -- ) {
        var obj = setup.scene.children[i];
        setup.scene.remove(obj);
        dispose3(obj);
    }
    isCurve1=false;
    isCurve2=false;
    landmark=false;
    raycasterCurve = new THREE.Raycaster();
    pointGeometry = new THREE.Geometry();
    pointGeometry.vertices.push(new THREE.Vector3());
    isDrawing=false;
    LineStroke = new THREE.Object3D();
    Line1=new THREE.Line(new THREE.Geometry(),material1);
    Line2=new THREE.Line(new THREE.Geometry(),material2);
    Line1.name="Line1";
    Line2.name="Line2";
    points1 = [ ];
    points2 = [ ];
    landmarkData1=[];
    landmarkData2=[];    
}
function curve1(){
    isCurve1=true; 
    isCurve2=false; 
    landmark=false;
}
function curve2(){
    isCurve2=true;
    isCurve1=false;
    landmark=false;
}
function selectLandmarks(){
    if(setup.scene.children.length!=2) console.log("falta curvas");
    else{
        isCurve2=false;
        isCurve1=false;
        landmark=true;
    }
}
function doaligns(){
    var n=Math.min(landmarkData1.length,landmarkData2.length);
    if(n>1){
        var Rt=aligns(landmarkData1.slice(0,n),landmarkData2.slice(0,n));
        var R=Rt[0];
        var t=Rt[1];
        var T=new THREE.Matrix4();
        T.set(R.val[0],R.val[1],R.val[2],t[0],R.val[3],R.val[4],R.val[5],t[1],R.val[6],R.val[7],R.val[8],t[2],0,0,0,1);
        Line1.applyMatrix(T);
        var correspondences=setup.scene.getObjectByName("Correspondences");
        for(var i=0;i<n;i++){
            landmarkData1[i].applyMatrix4(T);
            correspondences.children[0].children[2*i].applyMatrix(T);
        }
        correspondences.geometry.verticesNeedUpdate=true;
        correspondences.material=finalcorrespondencesmaterial;
        Line1.geometry.verticesNeedUpdate=true;
        var pintersection=setup.scene.getObjectByName("intersectPoint"); 
        setup.scene.remove(pintersection); 
        landmark=false;
    }
    else{
        console.log("insufficient data");
    }
    
}
d3.select("#clearButton").on("click",clear);
d3.select("#c1Button").on("click",curve1);
d3.select("#c2Button").on("click",curve2);
d3.select("#lButton").on("click",selectLandmarks);
d3.select("#alButton").on("click",doaligns);