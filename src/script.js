var speedtest = {
    
    check_speedtest : function () {

        var API_URL = "http://api.airscarp.com:40/server/command/send?ckey=54256cc608a64abd9d046225a0043361&skey=e79bbabf0fbd4c50943e2ff89e2d2c07";
        var data    = {command: "speedtest-cli"};
    
        $.post(API_URL, data, function(x){
            
            var output = x.data;
            console.log(output);
            
            var download_regex = /Download: ([0-9\.]+) Mbit\/s/g;
            var upload_regex   = /Upload: ([0-9\.]+) Mbit\/s/g;
    
            var download = download_regex.exec(output)[1];
            var upload   = upload_regex.exec(output)[1];
    
            console.log(download, upload);
    
            $("#download-speed").text(download);
            $("#upload-speed").text(upload);
        });
    }
};
