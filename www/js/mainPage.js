

   var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 

    // Wait for Cordova to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // Cordova is ready to be used!
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    /*function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64 encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }*/

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    
// A button will call this function
//
    function capturePhoto() {
        sessionStorage.removeItem('imagepath');
    // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
            destinationType : Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum : true});
    }

    function onPhotoDataSuccess(imageURI) { 
        // Uncomment to view the base64 encoded image data
        // console.log(imageData);

        // Get image handle
        //
        var imgProfile = document.getElementById('imgProfile');

        // Show the captured photo
        // The inline CSS rules are used to resize the image
        //
        imgProfile.src = imageURI;
        if(sessionStorage.isprofileimage==1){
            getLocation();
        }
        movePic(imageURI);
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
        alert('Failed because: ' + message);
    }

    function movePic(file){ 
        window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
    } 

    //Callback function when the file system uri has been resolved
    function resolveOnSuccess(entry){ 
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "ozEge";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.moveTo(directory, newFileName,  successMove, resOnError);
                    },
                    resOnError);
                    },
    resOnError);
    }

    //Callback function when the file has been moved successfully - inserting the complete  path
    function successMove(entry) {
    //Store imagepath in session for future use
    // like to store it in database
        sessionStorage.setItem('imagepath', entry.fullPath);
    }

    function resOnError(error) {
        alert(error.code);
    } 

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }
