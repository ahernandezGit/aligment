//P and Q are points sets to be aligned
// P is an array of THREE.Vector3 
// Q is an array of THREE.Vector3 
function aligns(P,Q){
    var n=P.length;
    var m=Q.length;
    if(n!=m)  return "Error, points to align are not of the same size"
    else if(n>1){
        //1. Compute the centroids of both point sets:
        var p=new THREE.Vector3();
        var q=new THREE.Vector3();
        for(var i=0;i<n;i++){
            p.add(P[i]);
            q.add(Q[i]);
        }
        p.divideScalar(n);
        q.divideScalar(n);
        //2. Compute the centered vectors and store it in the matrixs X and Y
        var X=zeros(3,n);
        var Y=zeros(3,n)
        for(var i=0;i<n;i++){
            X.val[i]=P[i].x-p.x;
            X.val[n+i]=P[i].y-p.y;
            X.val[2*n+i]=P[i].z-p.z;
            Y.val[i]=Q[i].x-q.x;
            Y.val[n+i]=Q[i].y-q.y;
            Y.val[2*n+i]=Q[i].z-q.z;
        }
        //3. Compute the 3 × 3 covariance matrix H
        var YT=transposeMatrix(Y);
        var H=mulMatrixMatrix(X,YT);
        //4. Compute the singular value decomposition H = UΣV
        var svdH= svd(H, "full");
        //5. The rotation we are looking for is then R=V*UT
        var R=mulMatrixMatrix(svdH.V,transposeMatrix(svdH.U));
        //5. Compute the optimal translation as
        var t=subVectors(q.toArray(),mulMatrixVector(R,p.toArray()));
        return [R,t];    
    }
}