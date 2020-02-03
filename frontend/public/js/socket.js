var textBox = `<div 
style="background: linear-gradient(40deg,#4caf5014,#ffeb3b17);
border-radius: 3px;
border: 3px solid #d5d5d500;
color: #333333;
border-image-source: linear-gradient(to right, #4caf5080, #9c27b0a8, #03a9f4a6);
border-image-slice: 1;
font-family: inherit;
font-size: inherit;
font-stretch: inherit;
font-style: inherit;
font-variant: inherit;
font-weight: inherit;
line-height: inherit;
margin: 0px;
padding: 1em;
vertical-align: baseline;">Bạn đã hoàn thành quy trình kich hoạt mã giới thiệu. Trở lại bảng điều khiển để sao chép liên kết và chia sẻ !</div>`

var completeBox = `<div 
style="background: linear-gradient(40deg,#4caf5014,#ffeb3b17);
border-radius: 3px;
border: 3px solid #d5d5d500;
color: #333333;
border-image-source: linear-gradient(to right, #4caf5080, #9c27b0a8, #03a9f4a6);
border-image-slice: 1;
font-family: inherit;
font-size: inherit;
font-stretch: inherit;
font-style: inherit;
font-variant: inherit;
font-weight: inherit;
line-height: inherit;
margin: 0px;
padding: 1em;
vertical-align: baseline;">Bạn đã đặt hàng thành công. Chúng tôi sẽ tiền hành xử lý đơn hàng và liên hệ lại sau !</div>`

const bankBox = (code, amount) => {
    return `<div class="row">
    <div class="col-lg-8 offset-lg-2">
        <div class="card">
            <div class="card-header">Thông tin nạp tiền</div>
            <table class="table table-bordered table-striped">
                <tbody>
                    <tr>
                        <td class="w-25"><span>Số tiền nạp</span>:</td>
                        <td class="text-success font-weight-bold">
                            <div class="copiable-div fiat-amount no-border" data-clipboard-value="108226">
                                <div class="main-container btn-position-left">
                                    <div class="content"><span><span class="safe-copy-fiat-amount">${amount}</span><span class="currency-VND"></span></span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="w-25"><span>Nội dung chuyển khoản</span>:</td>
                        <td class="font-weight-bold">
                            <div class="copiable-div banking-memo no-border" data-clipboard-value="D08220990P">
                                <div class="main-container btn-position-left">
                                    <div class="content"><span>${code}</span></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="w-25"><span>Tên tài khoản</span>:</td>
                        <td class="fiat-deposit-field bank_account_name">
                            <div class="copiable-div bank_account_name no-border" data-clipboard-value="CT TNHH TIN HOC DESIGNER">
                                <div class="main-container btn-position-left">
                                    <div class="content"><span>CT TNHH TIN HOC DESIGNER</span></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="w-25"><span>Số tài khoản</span>:</td>
                        <td class="fiat-deposit-field bank_account_number">
                            <div class="copiable-div bank_account_number no-border" data-clipboard-value="0371000497961">
                                <div class="main-container btn-position-left">
                                    <div class="content"><span>0371000497961</span></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="w-25"><span>Chi nhánh</span>:</td>
                        <td class="fiat-deposit-field bank_branch">
                            <div class="copiable-div bank_branch no-border" data-clipboard-value="Ho Chi Minh">
                                <div class="main-container btn-position-left">
                                    <div class="content"><span>Ho Chi Minh</span></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="w-25"><span>Tên ngân hàng</span>:</td>
                        <td class="fiat-deposit-field bank_name"><span><span>Vietcombank</span></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>`
}

const cartBox = cart => {
    return `<li id="${cart.time}"> <a href="#" style="padding: 0 !important;margin-right: 15px;float: left;display: block;width: 50px;height: 50px;left: 15px;top: 15px;"><img src="${cart.img}" class="cart-thumb" alt="${cart.name}"></a> 
    <h6><a href="#">${cart.name}</a>
    </h6> 
    <p>${cart.amount}x - <span style="font-weight: bold;color:#FF6666;">${cart.pay/1000} Kđ</span>
    </p> 
   </li>`
}

function init(input) {
    var $ = go.GraphObject.make;  // for conciseness in defining templates
  
    myDiagram =
      $(go.Diagram, "myDiagramDiv", // must be the ID or reference to div
        {
          maxSelectionCount: 0, // users can select only one part at a time
          validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
          layout:
            $(go.TreeLayout,
              {
                treeStyle: go.TreeLayout.StyleLastParents,
                arrangement: go.TreeLayout.ArrangementHorizontal,
                // properties for most of the tree:
                angle: 90,
                layerSpacing: 35,
                // properties for the "last parents":
                alternateAngle: 90,
                alternateLayerSpacing: 35,
                alternateAlignment: go.TreeLayout.AlignmentBus,
                alternateNodeSpacing: 20
              }),
        });
  
    var levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB",
      "#008299", "#D24726", "#008A00", "#094AB2"];
  
    // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
    myDiagram.layout.commitNodes = function() {
      go.TreeLayout.prototype.commitNodes.call(myDiagram.layout);  // do the standard behavior
      // then go through all of the vertexes and set their corresponding node's Shape.fill
      // to a brush dependent on the TreeVertex.level value
      myDiagram.layout.network.vertexes.each(function(v) {
        if (v.node) {
          var level = v.level % (levelColors.length);
          var color = levelColors[level];
          var shape = v.node.findObject("SHAPE");
          if (shape) shape.stroke = $(go.Brush, "Linear", { 0: color, 1: go.Brush.lightenBy(color, 0.05), start: go.Spot.Left, end: go.Spot.Right });
        }
      });
    };
  
    // This function provides a common style for most of the TextBlocks.
    // Some of these values may be overridden in a particular TextBlock.
    function textStyle() {
      return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
    }
  
    // This converter is used by the Picture.
    function findHeadShot(key) {
      return "../images/avatars/" + key + ".png"
    }
  
    // define the Node template
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        // for sorting, have the Node.text be the data.name
        new go.Binding("text", "name"),
        
        $(go.Shape, "Rectangle",
          {
            name: "SHAPE", fill: "#333333", stroke: 'white', strokeWidth: 3.5,
            // set the port properties:
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
          }),
        $(go.Panel, "Horizontal",
          $(go.Picture,
            {
              name: "Picture",
              desiredSize: new go.Size(80, 80),
              margin: 1.5,
            },
            new go.Binding("source", "key", findHeadShot)),
          // define the panel where the text will appear
          $(go.Panel, "Table",
            {
              minSize: new go.Size(130, NaN),
              maxSize: new go.Size(230, NaN),
              margin: new go.Margin(6, 10, 0, 6),
              defaultAlignment: go.Spot.Left
            },
            $(go.RowColumnDefinition, { column: 2, width: 4 }),
  
            $(go.TextBlock, textStyle(),  // the name
              {
                row: 0, column: 0, columnSpan: 5,
                font: "12pt Segoe UI,sans-serif",
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 16)
              },
              new go.Binding("text", "name").makeTwoWay()),
  
            $(go.TextBlock, "Phone: ", textStyle(),
              { row: 1, column: 0 }),
  
            $(go.TextBlock, textStyle(),
              {
                row: 1, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding("text", "phone").makeTwoWay()),
  
              $(go.TextBlock, "Email: ", textStyle(),
              { row: 2, column: 0 }),
  
            $(go.TextBlock, textStyle(),
              {
                row: 2, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding("text", "email").makeTwoWay()),
  
              $(go.TextBlock, "Sales: ", textStyle(),
              { row: 3, column: 0 }),
  
              $(go.TextBlock, textStyle(),
                {
                  row: 3, column: 1, columnSpan: 4,
                  editable: true, isMultiline: false,
                  minSize: new go.Size(10, 14),
                  margin: new go.Margin(0, 0, 0, 3)
                },
                new go.Binding("text", "person").makeTwoWay()),
              
                $(go.TextBlock, "Key: ", textStyle(),
                { row: 4, column: 0 }),
    
                $(go.TextBlock, textStyle(),
                  {
                    row: 4, column: 1, columnSpan: 4,
                    editable: true, isMultiline: false,
                    minSize: new go.Size(10, 14),
                    margin: new go.Margin(0, 0, 0, 3)
                  },
                  new go.Binding("text", "key").makeTwoWay()),

                  $(go.TextBlock, "Parent: ", textStyle(),
                  { row: 5, column: 0 }),
      
                  $(go.TextBlock, textStyle(),
                    {
                      row: 5, column: 1, columnSpan: 4,
                      editable: true, isMultiline: false,
                      minSize: new go.Size(10, 14),
                      margin: new go.Margin(0, 0, 0, 3)
                    },
                    new go.Binding("text", "parent").makeTwoWay()),

            // $(go.TextBlock, textStyle(),
            //   { row: 4, column: 0 },
            //   new go.Binding("text", "key", function(v) { return "ID: " + v; })),
            // $(go.TextBlock, textStyle(),
            //   { row: 5, column: 0, }, // we include a name so we can access this TextBlock when deleting Nodes/Links
            //   new go.Binding("text", "parent", function(v) { return "Parent: " + v; })),
          )  // end Table Panel
        ) // end Horizontal Panel
      );  // end Node
  
    myDiagram.linkTemplate =
      $(go.Link, go.Link.Orthogonal,
        { corner: 5, relinkableFrom: true, relinkableTo: true },
        $(go.Shape, { strokeWidth: 1.5, stroke: "#F5F5F5" }));  // the link shape
  
    myDiagram.model = go.Model.fromJson(input);
  
    document.getElementById('zoomToFit').addEventListener('click', function() {
      myDiagram.commandHandler.zoomToFit();
    });
  
    document.getElementById('centerRoot').addEventListener('click', function() {
      myDiagram.scale = 1;
      myDiagram.commandHandler.scrollToPart(myDiagram.findNodeForKey(1));
    });
  }

const map = new Map()
jQuery(document).ready(() => {
    const socket = io()



    socket.on('connect', () => {
        console.log(socket.io.engine.id)
        if (jQuery('#upload').length > 0) {
            
            var uploader = new SocketIOFileUpload(socket)
            // uploader.listenOnInput(document.getElementById("siofu_input"))
            uploader.listenOnSubmit(document.getElementById("upload"), document.getElementById("siofu_input"));
        
            jQuery('#siofu_input').change((e) => {
                var fileName = e.target.files[0].name;
                jQuery('#siofu_input').attr("data-title", fileName)
                setTimeout(()=>{
                    jQuery('#avt').replaceWith(`<img id="avt" style="margin: 0px 200px 0px 75px;width:300px;height:300px;" src="/images/avatars/${fileName}" alt="">`)
                    jQuery('#avt_logo').replaceWith(`<img id="avt_logo" class="user-avatar rounded-circle" src="/images/avatars/${fileName}" alt="User Avatar">`)
                    jQuery('#siofu_input').attr("data-title", "Drag and drop a file")

                    setTimeout(()=>{
                        socket.emit('uploadavt', {
                            avatar: fileName,
                            id: jQuery('#upload').data().user
                        })
                    },2000)
                },3000)
            })
        }
    })

    socket.on('testClient', data => console.log(data))
    socket.emit('testServer', "Hello Server")

    jQuery('#send').click(() => {
        socket.emit('testButton',jQuery('#name').val())
    })

    jQuery('a#step_finish').click(() => {
        socket.emit('finishInitial',{
            wizard: {
                identifier: jQuery('#cmnd').val(),
                fullname: jQuery('#fullname').val(),
                born: jQuery('#born').val(),
                domicile: jQuery('#domicile').val(),
    
                owner: jQuery('#bankowner').val(),
                bank: jQuery('#bankname').val(),
                account: jQuery('#bankaccount').val(),
                branch: jQuery('#bankpin').val(),
    
                checkStatus: false,
            },
            carts: [{
                img: 'fist',
                time: Date.now().toString(),
                name: jQuery('#name_product').data().name,
                code: jQuery('#code_product').text(),
                amount: Number(jQuery('#first_amount').val()),
                pay: Number(jQuery('#unit_price').text())*Number(jQuery('#first_amount').val()),
            }],

            attach: {
                payment: jQuery('#payment').val(),
                ttphanphoi: jQuery('#ttphanphoi').val(),
                nguoinhan: jQuery('#nguoinhan').val(),
                sodienthoai: jQuery('#sodienthoai').val(),
                diachinhan: jQuery('#diachinhan').val(),
            }
        })
    })

    socket.on('wizardComplete', data =>{
        if (data.code == ''){
            jQuery('#status').html(textBox)
        } else {
            jQuery('#status').html(bankBox(data.code, data.amount))
        }
    })

    const eventBuy = id => {
        jQuery(`#${id}`).click(()=>{
            const cart = {
                time: Date.now().toString(),
                img: jQuery(`#pic_${id}`).attr('src'),
                code: jQuery(`#code_${id}`).text(),
                name: jQuery(`#name_${id}`).text(),
                amount: jQuery(`#amount_${id}`).val(),
                pay: jQuery(`#unit_${id}`).text()*jQuery(`#amount_${id}`).val(),
            }
            socket.emit('addCart',cart)
            jQuery('li.total').prepend(cartBox(cart))
            jQuery('span#cart_total').replaceWith(`<span class="price" id="cart_total">${Number(jQuery('#cart_total').text())+cart.pay/1000}</span>`)
            jQuery('span#cart_number').replaceWith(`<span class="count bg-primary" id="cart_number">${Number(jQuery('#cart_number').text())+1}</span>`)
        })
    }

    socket.on('loadsanpham', data => {
        data.products.forEach((item) => {
            eventBuy(item.code)
        })
    })

    socket.on('mycart', data => {
        data.carts.forEach(item => {
                jQuery(`#change_${item.time}`).change(()=>{
                    //gui ve server xu ly

                    //reload
                    var change = jQuery(`#change_${item.time}`).val()* ((item.pay / item.amount)/1000)
                    jQuery(`#pay_${item.time}`).html(change)
                    jQuery(`#x_${item.time}`).html(jQuery(`#change_${item.time}`).val())
                    if (map.get(item.time) == undefined) {
                        map.set(item.time,item.amount)
                    }

                    var changeTotal = jQuery(`#change_${item.time}`).val() - map.get(item.time)
                    var luu = Number(jQuery('#cart_total_1').text()) + changeTotal*((item.pay / item.amount)/1000)
                    jQuery('#cart_total').html(Number(jQuery('#cart_total').text()) + changeTotal*((item.pay / item.amount)/1000))
                    jQuery('#cart_total_1').html(Number(jQuery('#cart_total_1').text()) + changeTotal*((item.pay / item.amount)/1000))
                    jQuery('#cart_total_2').html(Number(jQuery('#cart_total_2').text()) + changeTotal*((item.pay / item.amount)/1000))

                    socket.emit('changeAmount',{
                        time: item.time,
                        amount: jQuery(`#change_${item.time}`).val(),
                        pay: change*1000,
                        total: luu*1000,
                    })

                    map.set(item.time,jQuery(`#change_${item.time}`).val())
                })

                jQuery(`#button_${item.time}`).click(()=>{
                    //gui ve server xu ly
                    socket.emit('removeCart',{
                        time: item.time,
                        total: (Number(jQuery('#cart_total_1').text()) - Number(jQuery(`#pay_${item.time}`).text()))*1000,
                        number: Number(jQuery('#cart_number').text()) - 1,
                    })
                    //reload
                    jQuery('#cart_total').html(Number(jQuery('#cart_total').text()) - Number(jQuery(`#pay_${item.time}`).text()))
                    jQuery('#cart_total_1').html(Number(jQuery('#cart_total_1').text()) - Number(jQuery(`#pay_${item.time}`).text()))
                    jQuery('#cart_total_2').html(Number(jQuery('#cart_total_2').text()) - Number(jQuery(`#pay_${item.time}`).text()))
                    jQuery(`#line_${item.time}`).replaceWith('<tr></tr>')
                    jQuery(`#${item.time}`).replaceWith('<tr></tr>')
                    jQuery('#cart_number').html(Number(jQuery('#cart_number').text()) - 1)
                })
        })
    })

    jQuery('#buttonModal').click(() => {
        socket.emit('completeOrder',{
            attach: {
                payment: jQuery('#payment').val(),
                ttphanphoi: jQuery('#ttphanphoi').val(),
                nguoinhan: jQuery('#nguoinhan').val(),
                sodienthoai: jQuery('#sodienthoai').val(),
                diachinhan: jQuery('#diachinhan').val(),
            },
            total: Number(jQuery('#cart_total_2').text())*1000,
        })
    })

    socket.on('completeModal', data =>{
        if (data.code == ''){
            jQuery('#cart_number').html(0)
            jQuery('#status').html(completeBox)
        } else {
            jQuery('#cart_number').html(0)
            jQuery('#status').html(bankBox(data.code, data.amount))
        }
    })

    socket.on('xldonhang', data => {
        data.history.forEach((item) => {
            console.log(item.id)
            jQuery(`#phone_${item.id}`).click(() => {
                socket.emit('goidien',{
                    id: item.id,
                    status: "Đã liên hệ"
                })
            })
            jQuery(`#car_${item.id}`).click(() => {
                socket.emit('giaohang',{
                    id: item.id,
                    status: "Đang giao hàng"
                })
            })
            jQuery(`#check_${item.id}`).click(() => {
                socket.emit('thanhcong',{
                    id: item.id,
                    status: "Thành công",
                    total: Number(jQuery(`#total_${item.id}`).text())
                })
                jQuery(`#${item.id}`).replaceWith('<tr></tr>')
            })
        })
    })

    jQuery('#add-product').click(() => {
        socket.emit('themsp',{
            code: jQuery('#code').val(),
            name: jQuery('#name').val(),
            unit: Number(jQuery('#unit').val()),
            img: jQuery('#img').val(),
        })
    })

    jQuery('#remove-product').click(() => {
        socket.emit('xoasp',{
            code: jQuery('#code').val(),
        })
    })

    jQuery('#bt-bonus').click(() => {
        socket.emit('setbonus',{
            bonus: Number(jQuery('#bonus').val()),
        })
    })

    jQuery('#level').click(() => {
        socket.emit('setlevel',{
            label: jQuery('#label').val(),
            text: jQuery('#text').val(),
            limit: Number(jQuery('#limit').val()),
            coe: Number(jQuery('#coe').val()),
        })
    })

    socket.on('taocay', data => {
        const dom = {
            class: "go.TreeModel",
            nodeDataArray: data.tree
        }
        if (jQuery("#myDiagramDiv").length > 0){
            init(dom)
        }
    })

    jQuery('#withdraw').click(() => {
        var luu = Number(jQuery('#max').text())
        if (Number(jQuery('#receive').val()) >= Number(jQuery('#max').text())) {
            jQuery('#limit_withdraw').html('Số tiền cần rút đã vượt quá hạn mức')
            setTimeout(()=>{
                jQuery('#limit_withdraw').html(`&nbsp;Rút tối đa: <span id="max">${luu}</span>`)
            },2000)
        } else {
            jQuery('#max').html(`${Number(jQuery('#max').text()) - Number(jQuery('#receive').val())}`)
            socket.emit('ruttien', {
                id: jQuery('#withdraw').data().user,
                amount: Number(jQuery('#receive').val()),
            })
        }
    })

    socket.on('xulirut', data => {
        data.bank.forEach((item) => {
            jQuery(`#guitien_${item.st}`).click(() => {
                jQuery(`#ruttien_${item.st}`).replaceWith('<tr></tr>')
                socket.emit('xoalenhrut', item.st)
            })
        })
    })

    jQuery('#change_info').click(() => {
        jQuery('#change_info').html('Thành Công')
        setTimeout(()=>{
            jQuery('#change_info').html('Lưu')
        },2000)
        socket.emit('doithongtin', {
            id: jQuery('#change_info').data().user,
            change: {
                username: jQuery('#username').val(),
                phone: jQuery('#phone').val(),
                email: jQuery('#email').val(),
                wizard: {
                    owner: jQuery('#owner').val(),
                    account: jQuery('#account').val(),
                    bank: jQuery('#bank').val(),
                    branch: jQuery('#branch').val(),
                }
            },
        })
    })

    jQuery('#export').click(() => {
        socket.emit('xuatfile', jQuery('#export-type').val())
    })
    socket.on('download', data => {
        jQuery('#taive').html(`<a role="button" class="btn btn-warning btn-block" href="/export/${data}">Tải File</a>`)
    })
})