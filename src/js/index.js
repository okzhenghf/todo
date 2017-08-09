var task_list=[];  //任务列表
var $add_task=$(".add-task")  //提交
     init();  //初始化

//初始化
function init() {
   task_list=store.get("gg") || [];

    createHtml()

}
//点击提交
   $add_task.on("submit",function(ev){
    ev.preventDefault(); //阻止默认事件

    var obj={};
    obj.content=$add_task.find("input").eq(0).val();


    if (!obj.content) return;

    add_task(obj);
    createHtml(); //生成html
    $add_task.find("input").eq(0).val(null);  //清空
});

//把对像push数组里面
function add_task(obj) {
    task_list.push(obj);
    //存储到浏览器
    store.set("gg",task_list)
}

//生产html
function createHtml() {
    var $task_list=$(".task-list");
    $task_list.html(null)

    for(var i=0;i<task_list.length;i++){
         var $item=binding(task_list[i],i)

         $task_list.prepend($item)
    }
    bindelete()//删除任务列表
    bindetail()//弹框
    add_complate()//添加complate
}
//绑定html
function binding(data,index) {
    var str='<li data-index="'+index+'">'+
            '<input type="checkbox" '+(data.complated ? "checked" : "")+' class="complate" >'+
            '<p class="content">'+data.content+'</p>'+
            '<div class="right">'+
            '<span class="delete r-main">删除</span>'+
            '<span class="detail r-main">详细</span>'+
            '</div>'+
            '</li>';
    return str;
}

/*--------------------------------------删除 start---------------------------------------------------*/
//点击事件
function bindelete() {
    $(".delete.r-main").click(function () {

        var index=$(this).parent().parent().data(index);
        remove_task_list(index)
    })
}

//删除功能
function remove_task_list(index) {
    var off=confirm("你确定要删除吗?")
    if(!off) return;

    task_list.splice(index,1)
    refresh_task_list()
}


//更新本地存储
function refresh_task_list() {
    store.set("gg","task_list");
    createHtml();//更新列表
}
/*--------------------------------------删除 end---------------------------------------------------*/


/*--------------------------------------详细 start---------------------------------------------------*/
//点击获取index
function bindetail() {
    $(".detail.r-main").click(function () {
        var index=$(this).parent().parent().data(index).index;
        binHtml(index)

    })
}

//生产弹框

function binHtml(index) {
    var str='<div class="task-detail-mask"></div>'+
            ' <div class="task-detail">'+
            '<form class="up-task">'+
            '<h2 class="content">'+(task_list[index].content)+'</h2>'+
            '<div class="input-item">'+
            '<input type="text" class="title-detail">'+
            '</div>'+
            '<div class="input-item">'+
            '<textarea class="text">'+(task_list[index].text || "")+'</textarea>'+
            '</div>'+
            '<div class="remind input-item">'+
            '<label for="b">提醒时间</label>'+
            '<input id="b" class="datetime" type="date" value="'+task_list[index].datetime+'">'+
            '</div>'+
            '<div class="input-item">'+
            '<button>更新</button>'+
            '</div>'+
            '<div class="colse">X</div>'+
            '</form>'+
            '</div>'
    $(".container").append(str)
    remove_detail()
    bingenxin(index)
    altar();
}


//删除弹框
function remove_detail() {
    $(".task-detail-mask,.colse").click(function () {
        $(".task-detail-mask,.task-detail").remove()
    })
}
/*--------------------------------------详细 end---------------------------------------------------*/
/*--------------------------------------详细信息 start---------------------------------------------------*/
function bingenxin(index) {
    $(".up-task").on("submit",function (ev) {
        ev.preventDefault();


        var newobj={};
        newobj.content=$(this).find(".content").text()
        newobj.text=$(this).find(".text").val()
        newobj.datetime=$(this).find(".datetime").val()
        update(newobj,index)
        $(".task-detail-mask,.task-detail").remove()
        createHtml();  //更新html
    })
}
//双击修改
function altar() {
    $(".task-detail .up-task .content").dblclick(function () {
        var $that=$(this);
        var $title_detail=$(".container .task-detail .input-item .title-detail")
        $that.hide();
        $title_detail.show();

        $title_detail.focus();

        $title_detail.on("blur",function () {
            $that.show();
            $title_detail.hide();
            if(!$title_detail.val()) return;
            $that.text($title_detail.val())
        })
    })
}
//添加complate
function add_complate() {
    $(".complate").click(function () {
        var complate=$(".add-task .complate")
        complate.click(function () {
            var index=$(this).parent().parent().data(index).index;

            if(task_list[index].complated){
                update({complated:false },index)
            }
            else{
                update({complated:true },index)
            }

        })
    })
}
//更新
function update(newobj,index) {
    // task_list[index]=newobj;
    task_list[index]=$.extend({},task_list[index],newobj)
    store.set("gg",task_list)
    binHtml(index)
}
/*--------------------------------------详细信息 end---------------------------------------------------*/
