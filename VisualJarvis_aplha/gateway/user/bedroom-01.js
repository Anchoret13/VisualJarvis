/*
*卧室
*/
var util = require("./util.js");

var devicename = "bedroom-01";

//温度和湿度
var dht_val = { "tempe":"0.0℃","humi":"20%" };
//空气质量
var ppd42_val = 0;

function get_val()
{
    bzsdk.getdevice( devicename,"dht" );
    bzsdk.getdevice( devicename,"pdsm501a" );
}

bzsdk.on_device( devicename,"reg",function(){
    bzsdk.log( devicename + " device reg" );
    get_val();
});

bzsdk.on_device( devicename,"unreg",function(){
    bzsdk.log( devicename + " device unreg" );
    
                //只使用功率数据
            // bzsdk.send2phone( devicename,sen,val );
});

bzsdk.on_device( devicename,"val",function( sen,val ){
    switch( sen )
    {
        case "dht":{
            val = val.split(",");
            dht_val.tempe = val[1] + "℃"
            dht_val.humi = val[0] + "%";
            
            //上报到乐联网
            util.wl_update_data( "03",[ 
                {"Name":"tempe2","Value":val[1]},
                {"Name":"dht_humi2","Value":val[0]}
            ] );
            
            break;
        }
        case "pdsm501a":{
            ppd42_val = val;
            
            //上报到乐联网
           // util.wl_update_data( "03",[ 
            //    {"Name":"pm2","Value":val} ] );
            
            break;
        }
    }
});

bzsdk.on_phone( devicename,"get",function(sen,val){
    switch( sen )
    {
        case "dht_tempe":{
            bzsdk.send2phone( devicename,sen, dht_val.tempe );
            break;
        }
        case "dht_humi":{
            bzsdk.send2phone( devicename,sen, dht_val.humi );
            break;
        }
        case "pdsm501a":{
            bzsdk.send2phone( devicename,sen, ppd42_val );
            break;
        }
    }
});

setInterval( function(){
    get_val();
},6000 );