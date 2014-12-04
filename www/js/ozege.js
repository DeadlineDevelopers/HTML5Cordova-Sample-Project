/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

            var map;
            var marker;
            var watchID;
            
            var buttonsWidth;
            var pictureSource;   // picture source
            var destinationType; // sets the format of returned value 
            var lat;
            var lon;
            var base64;
            var images=[]; //array of images
            var imageCounter=0; //image counter
            //alert("image counter: "+imageCounter);
              //exper
            var menseiId;
            var bolgeId;
            var mintikaId;
            var alimNoktasiId;
            var koyId;
            //ekici id sqlden büyük bi integer geldiği için var a sığmıyor. balka bişey denenmeli
            var ekiciId;
            var userId;
            
            //exper
            //
            
            document.addEventListener("deviceready",onDeviceReady,false);
            
            function onDeviceReady() {
                
                
                pictureSource=navigator.camera.PictureSourceType;
                destinationType=navigator.camera.DestinationType;
                //$('#devamButonu').button('disable');
                $(window).unbind();
                $(window).bind('pageshow resize orientationchange', function(e) {
                    max_height();
                });
                max_height();
                google.load("maps", "3.8", {"callback": map, other_params: "sensor=true&language=en"});
                
                navigator.geolocation.getCurrentPosition(function(position) {
         
                    lat = position.coords.latitude.toString();
                    lon = position.coords.longitude.toString(); 
                    alert("1--"+lat+","+lon);

                    }, onError);
                
                
                
                dbcopy();//Datbase i Android device a kopylamak icin ilk sefer calıştırmada kullanılmalıdır...
               
                var db = window.sqlitePlugin.openDatabase({
                    name : "OZEGE"
                    //bgType : 1 
                });
                 
                db.transaction(function(tx)
                {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS TBL_C_EKICI_TAKIP_BILGISI (id INTEGER PRIMARY KEY,EKSPER_ID integer,EKICI_ID text,DONEM_ID integer,KONUM_X text, KONUM_Y text,ACIKLAMA text,TARIH text,POSTED integer)');          
                    tx.executeSql('CREATE TABLE IF NOT EXISTS TBL_C_RESIM (id INTEGER PRIMARY KEY,RESIM blob,GONDERI_ID integer,FOREIGN KEY(GONDERI_ID) REFERENCES TBL_C_EKICI_TAKIP_BILGISI(id))');
                    /*alert("iç");
                   
                          
                        tx.executeSql('INSERT INTO test_table (data,data_num) VALUES(?,?)', ["pictureData",123], function(tz,res)
                                {
                                   //alert("eklenen Id: " + res.insertId + " -- 1 olmalı"); 
                                }, function(e){
                                    console.log("HATA TBL_C_RESIM INSERT: " + e.message);
                                });
                                
                                tx.executeSql('INSERT INTO test_table (data,data_num) VALUES(?,?)', ["pictureData",123], function(tz,res)
                                {
                                   //alert("eklenen Id: " + res.insertId + " -- 1 olmalı"); 
                                }, function(e){
                                    console.log("HATA TBL_C_RESIM INSERT: " + e.message);
                                });
                                tx.executeSql('INSERT INTO test_table (data,data_num) VALUES(?,?)', ["pictureData",123], function(tz,res)
                                {
                                   //alert("eklenen Id: " + res.insertId + " -- 1 olmalı"); 
                                }, function(e){
                                    console.log("HATA TBL_C_RESIM INSERT: " + e.message);
                                });
                            
                        tx.executeSql("SELECT * from test_table;", [], function(tx, res) 
                        {   
                            alert("satır sayısı " + res.rows.length );
                           
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });    */
                });
    
            }   
            
            function getToday(){
                var t = new Date();
                var dd = t.getDate();
                var mm = t.getMonth()+1; //January is 0!
                var yyyy = t.getFullYear();

                if(dd<10) {
                    dd='0'+dd;
                } 

                if(mm<10) {
                    mm='0'+mm;
                } 

                 return dd+'/'+mm+'/'+yyyy;
                
            }
            /*cookie_name = "userid";
            var YouEntered;*/
          
            //
            
            //exper script             
            
                /*function getCookie() {
                    if(document.cookie)
                    {
                        index = document.cookie.indexOf(cookie_name);
                        if (index != -1)
                        {
                            namestart = (document.cookie.indexOf("=", index) + 1);
                            nameend = document.cookie.indexOf(";", index);
                        if (nameend == -1) 
                        {
                            nameend = document.cookie.length;
                        }
                        YouWrote = document.cookie.substring(namestart, nameend);
                        alert(YouWrote);
                        console.log(YouWrote);
                        }
                    }
                }*/
            
                function dbcopy()
                {
                        alert("dbcopy");
                        window.plugins.sqlDB.copy("OZEGE3.db",copysuccess,copyerror);
                        //Device içinde OZEGE(test icin)db yer aldığından isim değiştirlip(2,..,5) device a atılmıştır...
                        
                }

                function copysuccess()
                {
                    alert("succes");//open db and run your queries
                    
                }

            function copyerror()
            {
                alert("error");//db already exists or problem in copying the db file. Check the Log.
            }

          
            function populateMensei(){
                //alert("populate mensei");
                   var db = window.sqlitePlugin.openDatabase({
                        name : "OZEGE5"
                        //bgType : 1 
                    });
                    
                   db.transaction(function(tx)
                    {
                        tx.executeSql("SELECT ID,ADI FROM TBL_C_MENSEI WHERE ID IN(SELECT MENSEI_ID FROM TBL_J_USER_ROLE_ALIM_NOKTASI where USER_ID="+userId+");", [], function(tx, res)  // kullanıcı ıd ye göre gelcek
                        {   
                            //alert(res.rows.length);
                            if(res.rows.length>0)
                            {
                               for(var i=0;i<res.rows.length;i++)
                               {    
                                     //menseiId = res.rows.item(i).ID;
                                     //alert(menseiId);
                                    var list = document.getElementById('select-mensei');
                                    var option = document.createElement('option');
                                    option.text = res.rows.item(i).ADI;
                                    option.value = res.rows.item(i).ID;
                                    list.appendChild(option);
                               }
                            }
                            else
                            {
                                alert("Bu ekspere ait menşei bilgisi bulunamadı");
                            }
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                });
                

            }
            
            function fillBolge(){     
                //alert("fillBolge");
                 
        var selectbox = document.getElementById('select-bolge');
                 
                 for(var i=selectbox.options.length-1; i>=1; i--)
                    {
                        selectbox.remove(i);
                    }
                   
                    var db = window.sqlitePlugin.openDatabase({
                        name : "OZEGE5"
                        //bgType : 1 
                    });
                    
                    var e = document.getElementById('select-mensei');
                    menseiId = e.options[e.selectedIndex].value;
                    //alert(menseiId);                
                    db.transaction(function(tx)
                    {
                        //alert("iç");
                        tx.executeSql("SELECT ID,ADI FROM TBL_C_BOLGE WHERE ID IN(SELECT BOLGE_ID FROM TBL_J_USER_ROLE_ALIM_NOKTASI WHERE MENSEI_ID="+menseiId+" AND USER_ID="+userId+");", [], function(tx, res) 
                        {   
                            //alert(res.rows.length);
                            if(res.rows.length>0)
                            {
                               for(var i=0;i<res.rows.length;i++)
                               {    
                                    //alert(res.rows.item(i).ADI);
                                    var list = document.getElementById('select-bolge');
                                    var option = document.createElement('option');
                                    option.text = res.rows.item(i).ADI;
                                    option.value = res.rows.item(i).ID;
                                    list.appendChild(option);
                               }
                            }
                            else
                            {
                                alert("Bu menşeiye ait bölge bilgisi bulunamadı");
                            }
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                });
            }
            
            function fillMintika(){
                //alert("mıntıka");
                var selectbox = document.getElementById("select-mintika");
                 
                 for(var i=selectbox.options.length-1;i>=1;i--)
                    {
                        selectbox.remove(i);
                    }
                   
                    var db = window.sqlitePlugin.openDatabase({
                        name : "OZEGE5"
                        //bgType : 1 
                    });
                    
                    var e = document.getElementById("select-bolge");
                    bolgeId = e.options[e.selectedIndex].value;
                    //alert(bolgeId);                
                    db.transaction(function(tx)
                    {
                       // alert("mıntıka");
                        tx.executeSql("SELECT ID,ADI FROM TBL_C_MINTIKA WHERE ID IN(SELECT MINTIKA_ID FROM TBL_J_USER_ROLE_ALIM_NOKTASI WHERE USER_ID=6 AND MENSEI_ID="+menseiId+" AND BOLGE_ID="+bolgeId+");", [], function(tx, res) 
                        {   
                            //alert(res.rows.length);
                            if(res.rows.length>0)
                            {
                               for(var i=0;i<res.rows.length;i++)
                               {    
                                    //alert(res.rows.item(i).ADI);
                                    var list = document.getElementById('select-mintika');
                                    var option = document.createElement('option');
                                    option.text = res.rows.item(i).ADI;
                                    option.value = res.rows.item(i).ID;
                                    list.appendChild(option);
                               }
                            }
                            else
                            {
                                alert("Bu bölgeye ait mıntıka bilgisi bulunamadı");
                            }
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                });
            }
            
            function fillAlimNoktasi(){
                //alert("alım noktası");
                var selectbox = document.getElementById("select-alim-noktasi");
                 
                 for(var i=selectbox.options.length-1;i>=1;i--)
                    {
                        selectbox.remove(i);
                    }
                   
                    var db = window.sqlitePlugin.openDatabase({
                        name : "OZEGE5"
                        //bgType : 1 
                    });
                    
                    var e = document.getElementById("select-mintika");
                    mintikaId = e.options[e.selectedIndex].value;
                    //alert(mintikaId);                
                    db.transaction(function(tx)
                    {
                        //alert("alim noktasi");
                        tx.executeSql("SELECT ID,ADI FROM TBL_C_ALIM_NOKTASI WHERE ID IN(SELECT ALIM_NOKTASI_ID FROM TBL_J_USER_ROLE_ALIM_NOKTASI WHERE USER_ID="+userId+" AND MENSEI_ID="+menseiId+" AND BOLGE_ID="+bolgeId+" AND MINTIKA_ID="+mintikaId+");", [], function(tx, res) 
                        {   
                            //alert(res.rows.length);
                            if(res.rows.length>0)
                            {
                               for(var i=0;i<res.rows.length;i++)
                               {    
                                    //alert(res.rows.item(i).ADI);
                                    var list = document.getElementById('select-alim-noktasi');
                                    var option = document.createElement('option');
                                    option.text = res.rows.item(i).ADI;
                                    option.value = res.rows.item(i).ID;
                                    list.appendChild(option);
                               }
                            }
                            else
                            {
                                alert("Bu mıntıkaya ait alım noktası bulunamadı");
                            }
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                });
            }
            
            function fillKoy(){
               // alert("koy");
                var selectbox = document.getElementById("select-koy");
                 
                 for(var i=selectbox.options.length-1;i>=1;i--)
                    {
                        selectbox.remove(i);
                    }
                   
                    var db = window.sqlitePlugin.openDatabase({
                        name : "OZEGE5"
                        //bgType : 1 
                    });
                    
                    var e = document.getElementById("select-alim-noktasi");
                    alimNoktasiId = e.options[e.selectedIndex].value;
                    //alert(alimNoktasiId);                
                    db.transaction(function(tx)
                    {
                        
                        tx.executeSql("SELECT ID,ADI FROM TBL_C_KOY WHERE ALIM_NOKTASI_ID ="+alimNoktasiId+";", [], function(tx, res) 
                        {   
                           // alert(res.rows.length);
                            if(res.rows.length>0)
                            {
                               for(var i=0;i<res.rows.length;i++)
                               {    
                                    //alert(res.rows.item(i).ADI);
                                    var list = document.getElementById('select-koy');
                                    var option = document.createElement('option');
                                    option.text = res.rows.item(i).ADI;
                                    option.value = res.rows.item(i).ID;
                                    list.appendChild(option);
                               }
                            }
                            else
                            {
                                alert("Bu alım noktasına ait köy bilgisi bulunamadı");
                            }
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                });
            }
            
            function fillEkici(){
                //alert("koy");
                var selectbox = document.getElementById("select-ekici");
                 
                 for(var i=selectbox.options.length-1;i>=1;i--)
                    {
                        selectbox.remove(i);
                    }
                   
                    var db = window.sqlitePlugin.openDatabase({
                        name : "OZEGE5"
                        //bgType : 1 
                    });
                    
                    var e = document.getElementById("select-koy");
                    koyId = e.options[e.selectedIndex].value;
                    //alert(koyId);                
                    db.transaction(function(tx)
                    {
                        
                        tx.executeSql("SELECT OZ_KONT_NO,AD,SOYAD FROM TBL_C_EKICI WHERE KOY_ID="+koyId+" ;", [], function(tx, res) 
                        {   
                            //alert(res.rows.length);
                            if(res.rows.length>0)
                            {
                               for(var i=0;i<res.rows.length;i++)
                               {    
                                    //alert(res.rows.item(i).ADI);
                                    var list = document.getElementById('select-ekici');
                                    var option = document.createElement('option');
                                    option.text = res.rows.item(i).AD+" "+res.rows.item(i).SOYAD;
                                    option.value = res.rows.item(i).OZ_KONT_NO;
                                    list.appendChild(option);
                               }
                            }
                            else
                            {
                               alert("Bu köye ait ekici bilgisi bulunamadı");
                            }
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                });
            }
          
          function enableButon(){
              
              $('#devamButonu').button('enable');
              var e = document.getElementById("select-ekici");
              ekiciId = e.options[e.selectedIndex].value;
          }
          //exper script
      
        
            function Login(){
                 var username = document.getElementById("name").value;
                var password = document.getElementById("password").value;
                //alert(username);
                //alert(password);
                
                  var db = window.sqlitePlugin.openDatabase({
                        name : "OZEGE5"
                        //bgType : 1 
                    });
                                                                        
                    db.transaction(function(tx)
                    {
                        tx.executeSql("SELECT ID FROM TBL_C_USER WHERE USER_NAME='"+username+"' AND PASSWORD="+password+" AND ADMIN=0 AND AKTIF=1", [], function(tx, res) 
                        {                               
                            alert(res.rows.length);
                            if(res.rows.length>0)
                            {
                                window.navigator.notification.alert('Giriş başarlı',null,'Başarılı',null);
                                //alert('Giriş Başarılı');
                                /*var d = new Date();
                                d.setTime(d.getTime() + (1*24*60*60*1000));
                                var expires = "expires=" + d.toGMTString();*/                         
                                
                                //window.localStorage.removeItem("userid");
                                //putCookie(res.rows.item(0).ID);
                                
                                userId = res.rows.item(0).ID;
                                //alert("veritabanından gelen id:"+userId);
                                document.getElementById('loginSec').style.display='none';
                                document.getElementById('experSec').style.display='block';
                                
                                populateMensei();
                            }
                            else
                            {
                                //alert("Başarısız! Kullanıcı adı ya da şifre hatalı.");
                                window.navigator.notification.alert('Kullanıcı adı ya da şifre hatalı.',null,'Başarısız!','Tekrar dene');
                            }
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                });
                
                
                
            }
            
            /*function putCookie(id){
                alert(id);
                 if(document.cookie != document.cookie) 
                                    {index = document.cookie.indexOf(cookie_name);}
                                    else 
                                    { index = -1;}

                                    if (index == -1)
                                    {
                                    YouEntered = "6";
                                    document.cookie=cookie_name+"="+YouEntered;
                                    }
            }*/

    function onPhotoURISuccess(imageData) {
      // Uncomment to view the image file URI 
       console.log(imageData);
       alert(imageData);
       // Uncomment to view the base64 encoded image data
        
        //alert("image counter1: "+imageCounter);
        images[imageCounter] = imageData ;
        //images[imageCounter]=imageData;
        imageCounter = imageCounter + 1;
        
        //alert("image counter2: "+imageCounter);
        //console.log("IMAGE COUNTER: "+imageCounter);
        console.log(imageData);
        //base64 = imageData;
        //console.log(base64);
        //byteArray = native(imageData);                
        //alert(base64);
                                
        // Get image handle
        //
        
        var newImg=document.createElement("img");
        //newImg.setAttribute('src', 'data:image/jpeg;base64,' + imageData);
        //newImg.src=imageURI;
        newImg.src='data:image/jpeg;base64,' + imageData;
        newImg.setAttribute('alt', 'eklenen foto');
        //newImg.style.width= '120px';
        newImg.style.height= '150px';
        newImg.style.border='1px solid black';
        newImg.style.float='left';
        newImg.style.margin='5px';
        var imgList = document.getElementById('myList');
        imgList.appendChild(newImg);
                
    }

    
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        
        destinationType: destinationType.DATA_URL,  
        //destinationType: destinationType.FILE_URI,
        sourceType: source });
    }
    
    function capturePhoto() {
        //sessionStorage.removeItem('imagepath');
    // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
            
            //ekranda listelemek için kullanılan kod satırları
            destinationType : Camera.DestinationType.FILE_URI,
            //destinationType : Camera.DestinationType.DATA_URL,
            correctOrientation : true,
            saveToPhotoAlbum : true,
            encodingType: Camera.EncodingType.JPEG
            //kaydetmek için kullanılan kod satırları
            //destinationType : Camera.DestinationType.FILE_URI,
            //saveToPhotoAlbum : true
            
            
        
        });
    }
 
     function onPhotoDataSuccess(imageURI) { 
                                                  
        var newImg=document.createElement("img");
        //newImg.setAttribute('src', 'data:image/jpeg;base64,' + imageData);
        newImg.src=imageURI;
        
        //newImg.src='data:image/jpeg;base64,' + imageData;
        newImg.setAttribute('alt', 'eklenen foto');
        //newImg.style.width= '120px';
        newImg.style.height= '180px';
        newImg.style.border='2px solid black';
        newImg.style.float='left';
        newImg.style.margin='3px';
        var imgList = document.getElementById('myList');
        imgList.appendChild(newImg);
        
        //resmin kadı için kullanılan kod satırları*/
        if(sessionStorage.isprofileimage===1){
            getLocation();
        }
        movePic(imageURI);
        get_image_size_from_URI(imageURI);
        
    }
    
    function get_image_size_from_URI(imageURI) {
    // This function is called once an imageURI is rerturned from PhoneGap's camera or gallery function
        window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
            fileEntry.file(function(fileObject){
                // Create a reader to read the file
                var reader = new FileReader();

                // Create a function to process the file once it's read
                reader.onloadend = function(evt) {
                    // Create an image element that we will load the data into
                    var image = new Image();
                    image.onload = function(evt) {
                        // The image has been loaded and the data is ready
                        var image_width = this.width;
                        var image_height = this.height;
                        //console.log("IMAGE HEIGHT: " + image_height);
                        //console.log("IMAGE WIDTH: " + image_width);
                        alert("IMAGE HEIGHT: " + image_height);
                        alert("IMAGE WIDTH: " + image_width);
                        // We don't need the image element anymore. Get rid of it.
                        image = null;
                    };
                    // Load the read data into the image source. It's base64 data
                    
                    var b64data = evt.target.result;                                      
                    b64data = b64data.replace('data:image/jpeg;base64,','');                                              
                    images[imageCounter] = b64data;
                    imageCounter = imageCounter + 1;
                };
                // Read from disk the data as base64
                reader.readAsDataURL(fileObject);
            }, function(){
                console.log("Resmi okumada bir problem oluştu");
            });
        });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
        alert('Hata Oluştu: ' + message);
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
    var myFolderApp = "Oz-Ege";
 
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) 
    {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( 
            myFolderApp,
            {create:true, exclusive: false},
            function(directory) 
                {
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
        alert("HATA! : Resim kaydetme esnasında bir hata oluştu."+error.code);
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }

    function saveInfos() {
        
                var ekiciIdtxt = ekiciId.toString();
                var latitudetxt= 55;
                var longitudetxt = 65;
                var insertedId;
                var pictureData;
                var count = imageCounter;
                var db = window.sqlitePlugin.openDatabase({
                    name : "OZEGE5",
                    bgType : 1 
                });
                
                var tarih = getToday();
                alert(tarih);
                var aciklama = document.getElementById("textarea").value;       
                //alert(txt);

                 db.transaction(function(tx)
                    {
                        tx.executeSql("INSERT INTO TBL_C_EKICI_TAKIP_BILGISI (EKSPER_ID, EKICI_ID, DONEM_ID , KONUM_X, KONUM_Y, ACIKLAMA, TARIH, POSTED) VALUES(?,?,?,?,?,?,?,?)", [userId,ekiciIdtxt,1,latitudetxt,longitudetxt,aciklama,tarih,0]  , function(ty, res) //Gönderilme durumu denetlendi (POSTED)...
                        {

                            //alert("eklenen Id: " + res.insertId + " -- 1 olmalı");                   
                            //alert("eklenen Id: " + res.insertId + " -- should be valid");
                            insertedId = res.insertId;
                            while(imageCounter>0){
                                pictureData = images[imageCounter-1];
                                ty.executeSql('INSERT INTO TBL_C_RESIM (RESIM,GONDERI_ID) VALUES(?,?)', [pictureData,insertedId], function(tz,res)
                                {
                                //alert("eklenen Id: " + res.insertId + " -- 1 olmalı"); 
                                }, function(e){
                                    console.log("HATA TBL_C_RESIM INSERT: " + e.message);
                                });

                                imageCounter = imageCounter - 1;
                            }

                          
                            //alert("başarılı");


                            }, function(e) {
                                    console.log("HATA: " + e.message);
                                });
                    }); 
                    
                    convertToJSON();
                    
                    /*db.transaction(function(ta)
                    {        
                        ta.executeSql("SELECT * from TBL_C_EKICI_TAKIP_BILGISI;", [], function(tb, res) 
                        {
                            var tbl_ekici_cnt = res.rows.length;
                            tb.executeSql("SELECT * from TBL_C_RESIM;", [], function(tb, res) 
                            {
                                if(tbl_ekici_cnt==1 && count==res.rows.lenght){
                                    window.navigator.notification.alert('Bilgileriniz başarıyla kaydedilmiştir.', null, 'Başarılı', 'Tamam');
                                    convertToJSON();
                                }
                                
                            }, function(e) {
                                console.log("HATA: " + e.message);
                                });
                           
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                            
                        
                            
                            
                            
                    }); */
                            
                        /*tx.executeSql("SELECT id,KONUM_X,KONUM_Y,RESIM,ACIKLAMA from TBL_C_EKICI_TAKIP_BILGISI;", [], function(tx, res) 
                        {
                            alert("satır sayısı " + res.rows.length + " -- 1 olmalı");
                            alert("id: " + res.rows.item(0).id + " 1 olmalı");
                            alert("latitude: " + res.rows.item(0).KONUM_X + " -- olmalı");
                            alert("longituted: " + res.rows.item(0).KONUM_Y + " -- olmalı");
                            alert("resimsr: " + res.rows.item(0).RESIM + " -- olmalı");
                            alert("açıklama: " + res.rows.item(0).ACIKLAMA + " -- olmalı");
                        }, function(e) {
                            console.log("HATA: " + e.message);
                            });
                    



                    db.transaction(function(tx) 
                    {
                      tx.executeSql('DROP TABLE IF EXISTS test_table');
                      tx.executeSql('CREATE TABLE IF NOT EXISTS android_device (id integer primary key,isim text, yas integer)');

                      tx.executeSql("INSERT INTO android_device (isim, yas) VALUES (?,?)", ["onur", 22], function(tx, res) 
                        {
                            alert("eklenen Id: " + res.insertId + " -- 1 olmalı"); // check #18/#38 is fixed
                            alert("eklenen Id: " + res.insertId + " -- should be valid");				

                      }, function(e) {
                        console.log("HATA: " + e.message);
                      });

                  tx.executeSql("INSERT INTO android_device (isim, yas) VALUES (?,?)", ["furkan", 24], function(tx, res) 
                    {
                        alert("eklenen Id: " + res.insertId + " -- 2 olmalı"); // check #18/#38 is fixed
                        alert("eklenen Id: " + res.insertId + " -- should be valid");				

                  }, function(e) {
                    console.log("HATA: " + e.message);
                  });


                });*/


    }
          
    function convertToJSON(){              
                var newJson = { $ekicitakip: [] , $resimler: []};//Ekici Takip Tablosu ve Resim tablosundaki bilgiler ayrı JArray lerde tutulacak....

                var db = window.sqlitePlugin.openDatabase({
                    name : "OZEGE5"
                    //bgType : 1 
                });

                db.transaction(function(tx) {
                  
                    tx.executeSql("SELECT * FROM TBL_C_EKICI_TAKIP_BILGISI WHERE POSTED =0;" ,[],
                    function(tx, result) {                        
                        if (result != null && result.rows != null) {
                            
                            var j=0;//Resimleri olan takip bilgileri indisi icin..
                            var array = [];
                            
                            for (var k = 0; k < result.rows.length; k++) {                               
                                var row = result.rows.item(k);
                             
                                
                                
                               newJson.$ekicitakip[k] = { id : row.id, experId: row.EKPSER_ID, ekiciId: row.EKICI_ID, donemId: row.DONEM_ID, konumX: row.KONUM_X, konumY: row.KONUM_Y, aciklama: row.ACIKLAMA, tarih: row.TARIH};
                               alert(JSON.stringify(newJson.$ekicitakip[k]));               
                                
                                //alert(row.id);
                                tx.executeSql("SELECT * FROM TBL_C_RESIM WHERE GONDERI_ID="+row.id+" ;", [], function(tx, res) 
                                    {
                                        
                                        if(res.rows.length>0){
                                            //alert("resim");
                                             for (var i = 0; i < result.rows.length; i++){
                                                 //alert("FOR");
                                                 newJson.$resimler[j] = { id: res.rows.item(i).id ,gonderi_id : res.rows.item(i).GONDERI_ID , resim : res.rows.item(i).RESIM };
                                                 //alert(res.rows.item(i).GONDERI_ID+"  "+ j);                                                
                                                j++;
                                                alert(JSON.stringfy(newJson.$resimler[j]));
                                        }
                                        
                                        }                                        
                                    }, function(e) {
                                        console.log("RESIM-HATA: " + e.message);
                                        });
                                        
                                
                            }
                         
                         var eTakip = JSON.stringify(newJson.$ekicitakip);
                         alert(eTakip);
                         ekiciGonder(newJson);//EkiciTakibi biligleri gönderiliyor..
                         
                         alert(JSON.stringify(newJson.$resimler));
      
                         
                        }       
               
                    },function(e) {
                        console.log("EKICI-HATA: " + e.message);
                      });
                   
                    
                });
              
                //updatePosted();
            }
            function updatePosted(){//Gönderildi bilgileri işlenecek...
                alert("posted");
                
                var db = window.sqlitePlugin.openDatabase({
                    name : "OZEGE5"
                    //bgtype : 1
                });
                db.transaction(function (tx){
                    tx.executeSql("UPDATE TBL_C_EKICI_TAKIP_BILGISI SET POSTED=1 WHERE POSTED=0");
                });
            }
                       
            function ekiciGonder(data){
                $.ajax({//EkiciTakip tablosundan alınan veriler servera gönderiliyor...
                    type : "PUT",
                    url : "http://192.168.2.30:6589/ozegeservis/Service1.svc/AddEkici",                                        
                    contentType : "application/json; charset=utf-8",
                    data : JSON.stringify(data.$ekicitakip),
                    dataType : "json",
                    processData: true,                    
                    success: function (data, status, jqXHR) {
                        alert("success..." + data);
                    },
                    error: function (xhr) {
                        alert(xhr.responseText);
                    }                
                });
                
                }
                
                function resimGonder(data){
                    alert("Resim AJAX içinde ");
                    $.ajax({//Resimler(gönderi id ile beraber) servera gönderiliyor...
                    type : "PUT",
                    url : "http://192.168.2.30:6589/ozegeservis/Service1.svc/AddResim",                                        
                    contentType : "application/json; charset=utf-8",
                    data : JSON.stringify(data.$resimler),
                    dataType : "json",
                    processData: true,                    
                    success: function (data, status, jqXHR) {
                        alert("success..." + data);
                    },
                    error: function (xhr) {
                        alert(xhr.responseText);
                    }                
                });
                alert("Resim bilgileri gönderildi");
            }
            
                

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    
    function getMainPage(){
        
        
        document.getElementById('experSec').style.display='none';
        document.getElementById('mainPageSec').style.display='block';
    }   
             
         function adjustments(){
             
             
             $('#selectionBtn').css({
                  'width': ($('#loginSec').width()/2) + 'px'
                                               });
             $('#loginBtn').css({
                  'width': ($('#loginSec').width()/2) + 'px'
                                               });
             $('#saveBtn').css({
                  'width': ($('#loginSec').width()/2) + 'px'
                                                });
             $('#map').css({
                  'height': (($('#loginSec').width()*3)/5) + 'px'
                                                });
             $('#butonyarisi').css({
                  'width': ($('#loginSec').width()/2) + 'px'
                                                });                           
             $('#photoBtn').css({
                  'width': ($('#loginSec').width()/2) + 'px'
                                                });                                 
         }
         
         function getSelectPage(){
             document.getElementById('loginSec').style.display='none';
                                document.getElementById('experSec').style.display='block';
         }
         
        function max_height() {
            var h = $('div[data-role="header"]').outerHeight(true);
            var f = $('div[data-role="footer"]').outerHeight(true);
            var w = $(window).height();
            var c = $('div[data-role="content"]');
            var c_h = c.height();
            var c_oh = c.outerHeight(true);
            var c_new = w - h - f - c_oh + c_h;
            var total = h + f + c_oh;
            if (c_h < c.get(0).scrollHeight) {
                c.height(c.get(0).scrollHeight);
            } else {
                c.height(c_new);
            }
        }

        function map() {
            var latlng = new google.maps.LatLng(38.462722, 27.227212);
            var myOptions = {
                zoom: 15,
                center: latlng,
                streetViewControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true
            };
            map = new google.maps.Map(document.getElementById("map"), myOptions);

            google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
                watchID = navigator.geolocation.watchPosition(gotPosition, null, {maximumAge: 5000, timeout: 60000, enableHighAccuracy: true});
            });




        }


        // Method to open the About dialog
        function showAbout() {
            showAlert("Google Maps", "Created with NetBeans 7.4");
        }
        ;

        function showAlert(message, title) {
            if (window.navigator.notification) {
                window.navigator.notification.alert(message, null, title, 'OK');
            } else {
                alert(title ? (title + ": " + message) : message);
            }
        }

        function gotPosition(position) {
            map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

            var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            if (!marker) {
                //create marker
                marker = new google.maps.Marker({
                    position: point,
                    map: map
                });
            } else {
                //move marker to new position
                marker.setPosition(point);
            }


        }