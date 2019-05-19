var speedtest = {
    
    testing : false,
    
    parse : function(output){
        
        console.log("Parsing...");
        
        var download_regex = /Download: ([0-9\.]+) Mbit\/s/g;
        var upload_regex   = /Upload: ([0-9\.]+) Mbit\/s/g;
        var ping_regex     = /Hosted by.*?([0-9\.]+) ms\n/g;
        var from_regex     = /Testing from (.*?).../g;
        
        return {
            "download" : download_regex.exec(output)[1],
            "upload"   : upload_regex.exec(output)[1],
            "ping"     : ping_regex.exec(output)[1],
            "from"     : from_regex.exec(output)[1],
        };
    },
    
    show_results : function(data){
        
        console.log("Showing results...");
        
        $("#download-speed").text(data.download);
        $("#upload-speed").text(data.upload);
        $("#ping-speed").text(data.ping);
        $("#testing-from").text(data.from);
    },
    
    
    test : function () {
        
        if(!speedtest.testing){
        
            console.log("Testing...");    
            speedtest.testing = true;
    
            airscarp.plugin.exec("speedtest-cli", function(x){
                
                try {
                    if(!x.s) throw "Something went wrong.";
                    
                    // Parse
                    var results = speedtest.parse(x.output);
            
                    // Show
                    speedtest.show_results(results);
                    
                    airscarp.success("Successful!");
                    
                } catch (err) {
                    airscarp.error("Something went wrong.");
                }
                
                speedtest.testing = false;
            });
        }
    },
    
    
    save : function(){},
};

