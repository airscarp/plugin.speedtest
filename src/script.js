/**
* Output Example
* -----------------------
* Ping: 27.535 ms
* Download: 647.16 Mbit/s
* Upload: 4.14 Mbit/s
* Share results: http://www.speedtest.net/result/8269705320.png
* -----------------------
*/

var speedtest = {
    
    // Is testing now?
    testing : false,
    
    // Debug mode
    debug : true,
    
    // Cache time
    cache : 60 * 15,
    
    // Commands
    command : {
        "test"    : "speedtest-cli --share --simple",
        "version" : "speedtest-cli --version",
    },
    
    // LocalStorage
    localStorageAlias : "airscarp-plugin-speedteest",
    
    
    // Parse
    parse : function(output){
        
        try {
            output = output + "\n";
            output = output.toString();
            
            if(speedtest.debug) console.log("Parsing Data : ", output);
            
            var download_regex = /Download: ([0-9\.]+) Mbit\/s/g;
            var upload_regex   = /Upload: ([0-9\.]+) Mbit\/s/g;
            var ping_regex     = /Ping: ([0-9\.]+) ms\n/g;
            var share_regex    = /Share results: (.*?)\n/g;
            
            return {
                "download" : download_regex.exec(output)[1],
                "upload"   : upload_regex.exec(output)[1],
                "ping"     : ping_regex.exec(output)[1],
                "share"    : share_regex.exec(output)[1],
            };
        }
        catch (err) {
            if(speedtest.debug) console.error(err);
            throw "Parsing Error.";
        }
    },
    
    
    // Show Results
    show_results : function(data){
        
        if(speedtest.debug) console.log("Showing results...");
        
        $("#download-speed").text(data.download);
        $("#upload-speed").text(data.upload);
        $("#ping-speed").text(data.ping);
        $("#speedtest-share").attr("href", data.share);
    },
    
    
    // Speedtest
    test : function () {
        
        if(!speedtest.testing){
        
            if(speedtest.debug) console.log("Testing...");    
            speedtest.testing = true;
            
            $("#speedtest-run-btn").slideUp("fast");
            $("#speedtest-loading-bar").slideDown("fast");
    
            airscarp.plugin.exec(speedtest.command.test, function(x){
                
                try {
                    if(!x.s) throw "Something went wrong.";
                    
                    // Parse
                    var results = speedtest.parse(x.output);
                    
                    // Save data
                    speedtest.save(results);
            
                    // Show
                    speedtest.show_results(results);
                    
                    airscarp.success("Done!");
                    
                    $("#speedtest-run-btn").slideDown("fast");
                    $("#speedtest-loading-bar").slideUp("fast");
                    
                } catch (err) {
                    if(speedtest.debug) console.error(err);
                    airscarp.error(err);
                }
                
                speedtest.testing = false;
                
            }, speedtest.cache);
        }
    },
    
    
    // Save Data
    save : function(parsed_data){
        
        try{
            airscarp.plugin.db.set("latest-speed", parsed_data);
        }
        catch(err){
            if(speedtest.debug) console.error(err);
            airscarp.error("Error on save.");
        }
    },

    
    // Inıt
    init : function(){
        
        try {
            
            airscarp.plugin.db.get("latest-speed", function(data){
               
                console.log(data);
                if(data && data !== undefined && typeof data === "object"){
                    speedtest.show_results(data);
                } 
            });
            
        } catch (err) {
            if(speedtest.debug) console.error(err);
        }
        
        $("#speedtest-run-btn").slideDown("fast");
        $("#speedtest-loading-bar").slideUp("fast");
    },
};


$(function(){speedtest.init()});