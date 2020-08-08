import { Vector2 } from "./Vector2"
import { Rect } from "./Rect";
import { BlockRegData, BlockParameterTypeRegData, BlockParameterEnumRegData, BlockParameterEditorRegData, BlockEditorComponentCreateFn, BlockParametersChangeSettings, BlockStyleSettings } from "./BlockDef";
import { BlockParameterPort, BlockBehaviorPort, BlockPort, BlockPortEditorData } from "./Port";

import CommonUtils from "../utils/CommonUtils";
import AllEditors from "../model/TypeEditors/AllEditors";
import ParamTypeServiceInstance from "../sevices/ParamTypeService";
import { Block, OnUserAddPortCallback, OnUserAddParamCallback } from "./Block";
import { EditorInterface } from "./Editor";
import { ConnectorEditor } from "./Connector";


/**
 * 编辑器模式下的单元。
 * 扩展了单元的编辑事件操作与管理,供编辑器使用。
 * 运行时中不会声明此类。
 */
export class BlockEditor extends Block {

  public position : Vector2 = new Vector2();
  public size : Vector2 = new Vector2(150, 200);

  public name = "Single";
  public description = "This is a single block. Useage: unknow.";
  /**
   * 块的用户注释
   */
  public mark = "";

  public logo = "";

  public selected = false;
  public hover = false;

  private rect = new Rect();
  
  public editor : EditorInterface = null;

  public constructor(editor : EditorInterface, regData ?: BlockRegData) {
    super();
    this.isEditorBlock = true;
    this.editor = editor;
    if(regData)
      this.regData = regData;
    this.onAddPortElement = this.addPortElement;
    this.onRemovePortElement = this.removePortElement;
    this.onUpdatePortElement = this.updatePortElement;
  }

  public portBehaviorIcon = 'icon-sanjiaoxing';
  public portBehaviorIconActive = 'icon-zuo';
  public portParamIcon = 'icon-search2';
  public portParamIconActive = 'icon-yuan1';
  public portFailedIconActive = 'icon-close-';
  public portBehaviorAddIcon = 'icon-pluss-1';
  public portParamAddIcon = 'icon-pluss-1';
  public portPortDeleteIcon = 'icon-close-1';

  public blockStyleSettings = new BlockStyleSettings();

  public getRect() { 
    this.rect.setPos(this.position);
    this.rect.setSize(this.size);
    return this.rect; 
  }

  public el : HTMLDivElement = null;
  public elInputBehaviorPorts : HTMLDivElement = null;
  public elOutputBehaviorPorts : HTMLDivElement = null;

  public elAddInputBehaviorPort : HTMLElement = null;
  public elAddOutputBehaviorPort : HTMLElement = null;

  public elInputParamPorts : HTMLDivElement = null;
  public elOutputParamPorts : HTMLDivElement = null;

  public elAddInputParamPort : HTMLElement = null;
  public elAddOutputParamPort : HTMLElement = null;

  public elTitle : HTMLDivElement = null;
  public elTitleText : HTMLElement = null;
  public elCustomEditor : HTMLDivElement = null;

  public elLogo : HTMLDivElement = null;
  public elLogoRight : HTMLDivElement = null;
  public elLogoBottom : HTMLDivElement = null;

  public elBreakPointArrow : HTMLDivElement = null;
  public elBreakPointStatus : HTMLDivElement = null;

  public create() {
    
    if(this.regData) {
      this.name = this.regData.baseInfo.name;
      this.description = this.regData.baseInfo.description;
      this.logo = this.regData.baseInfo.logo;
      this.blockStyleSettings = this.regData.blockStyle;

      this.onCreateCustomEditor = this.regData.callbacks.onCreateCustomEditor;
      this.onUserAddPort = this.regData.callbacks.onUserAddPort;
      this.onUserAddParam = this.regData.callbacks.onUserAddParam;

      this.portsChangeSettings = this.regData.settings.portsChangeSettings;
      this.parametersChangeSettings = this.regData.settings.parametersChangeSettings;
    }

    let host = this.editor.getBlockHostElement();

    this.el = document.createElement('div');
    this.el.classList.add("flow-block");
    this.el.setAttribute("id", this.uid);

    let content = document.createElement('div');
    let areaPorts = document.createElement('div');
    let areaPortsBottom = document.createElement('div');

    this.elInputBehaviorPorts = document.createElement('div');
    this.elInputBehaviorPorts.classList.add("ports", 'input');
    this.elOutputBehaviorPorts = document.createElement('div');
    this.elOutputBehaviorPorts.classList.add("ports", 'output');

    this.elAddInputBehaviorPort = document.createElement('a');
    this.elAddOutputBehaviorPort = document.createElement('a');
    this.elAddInputBehaviorPort.classList.add('port-add','iconfont', 'Behavior', this.portBehaviorAddIcon);
    this.elAddOutputBehaviorPort.classList.add('port-add','iconfont', 'Behavior',this.portBehaviorAddIcon);
    this.elAddInputBehaviorPort.setAttribute('title', '添加入端口');
    this.elAddOutputBehaviorPort.setAttribute('title', '添加出端口');
    this.elAddInputBehaviorPort.onclick = this.onUserAddInputPort.bind(this);
    this.elAddOutputBehaviorPort.onclick = this.onUserAddOutputPort.bind(this);

    areaPorts.classList.add("area", "Behavior");
    areaPorts.appendChild(this.elInputBehaviorPorts);
    areaPorts.appendChild(this.elOutputBehaviorPorts);
    areaPortsBottom.classList.add("area-bottom", "Behavior");
    areaPortsBottom.appendChild(this.elAddInputBehaviorPort);
    areaPortsBottom.appendChild(this.elAddOutputBehaviorPort);

    let areaParamPorts = document.createElement('div');
    let areaParamPortsBottom = document.createElement('div');

    this.elInputParamPorts = document.createElement('div');
    this.elInputParamPorts.classList.add("ports", 'input');
    this.elOutputParamPorts = document.createElement('div');
    this.elOutputParamPorts.classList.add("ports", 'output');

    this.elAddInputParamPort = document.createElement('a');
    this.elAddOutputParamPort = document.createElement('a');

    this.elAddInputParamPort.classList.add('port-add','iconfont', 'Param', this.portParamAddIcon);
    this.elAddOutputParamPort.classList.add('port-add','iconfont', 'Param', this.portParamAddIcon);
    this.elAddInputParamPort.setAttribute('title', '添加入参数');
    this.elAddOutputParamPort.setAttribute('title', '添加出参数');
    this.elAddInputParamPort.onclick = this.onUserAddInputParam.bind(this);
    this.elAddOutputParamPort.onclick = this.onUserAddOutputParam.bind(this);

    areaParamPorts.classList.add("area", "Param");
    areaParamPorts.appendChild(this.elInputParamPorts);
    areaParamPorts.appendChild(this.elOutputParamPorts);
    areaParamPortsBottom.classList.add("area-bottom", "Param");
    areaParamPortsBottom.appendChild(this.elAddInputParamPort);
    areaParamPortsBottom.appendChild(this.elAddOutputParamPort);

    content.appendChild(areaPorts);
    content.appendChild(areaPortsBottom);
    content.appendChild(areaParamPorts);
    content.appendChild(areaParamPortsBottom);
    content.classList.add("content");

    this.elTitle = document.createElement('div');
    this.elTitle.classList.add("title");
    this.elTitle.setAttribute('title', this.description);
    if(!CommonUtils.isNullOrEmpty(this.blockStyleSettings.titleColor))
      this.elTitle.style.color = this.blockStyleSettings.titleColor;
    if(!CommonUtils.isNullOrEmpty(this.blockStyleSettings.titleBakgroundColor))
      this.elTitle.style.background = this.blockStyleSettings.titleBakgroundColor;
    if(this.blockStyleSettings.smallTitle || this.blockStyleSettings.noTitle) 
      this.elTitle.classList.add("small");

    this.elBreakPointArrow = document.createElement('div');
    this.elBreakPointArrow.classList.add('breakpoint-arrow','iconfont', 'icon-zuo');
    this.elBreakPointArrow.style.display = 'none';

    this.elBreakPointStatus = document.createElement('div');
    this.elBreakPointStatus.classList.add('breakpoint-status','iconfont');
    this.elBreakPointStatus.style.display = 'none';

    this.elCustomEditor = document.createElement('div');
    this.elCustomEditor.classList.add("custom-editor");

    if(this.blockStyleSettings.smallTitle || this.blockStyleSettings.noTitle) 
      this.elCustomEditor.classList.add('without-title');
    
    if(this.blockStyleSettings.smallTitle && !this.blockStyleSettings.noTitle) {

      let titleSmall = document.createElement('div');
      let titleSmallSpan = document.createElement('span');

      titleSmall.classList.add('title-small');
      titleSmallSpan.innerText = this.name
      titleSmall.setAttribute('title', this.description);
      titleSmall.appendChild(titleSmallSpan);
      this.el.appendChild(titleSmall);
    }
  
    this.elTitleText = document.createElement('span');
    this.elLogo = document.createElement('div');
    this.elLogo.classList.add("logo");
    this.elLogoRight = document.createElement('div');
    this.elLogoRight.classList.add("logo-right");
    this.elLogoBottom = document.createElement('div');
    this.elLogoBottom.classList.add("logo-bottom");

    this.el.appendChild(this.elBreakPointStatus);
    this.el.appendChild(this.elBreakPointArrow);
    this.el.appendChild(this.elTitle);
    this.el.appendChild(this.elCustomEditor);
    this.el.appendChild(content);

    this.elTitle.appendChild(this.elLogo);
    this.elTitle.appendChild(this.elTitleText);
    this.elTitle.appendChild(this.elLogoRight);
    this.elTitle.appendChild(this.elLogoBottom);

    this.el.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.el.addEventListener('mouseleave', this.onMouseOut.bind(this));
    this.el.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.el.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.el.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.el.addEventListener('resize', this.onResize.bind(this));
    this.el.addEventListener('wheel', this.onMouseWhell.bind(this));

    host.appendChild(this.el);

    super.create();

    if(typeof this.onCreateCustomEditor == 'function')
      this.onCreateCustomEditor(this.elCustomEditor, this, this.regData);

    this.createFn();
    this.updateContent();
    this.updateBreakPointStatus();
    this.onResize();

  }
  public destroy() {

    this.editor.onBlockDelete(this);

    this.el.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.el.removeEventListener('mouseleave', this.onMouseOut.bind(this));
    this.el.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.el.removeEventListener('resize', this.onResize.bind(this));
    this.el.removeEventListener('wheel', this.onMouseWhell.bind(this));

    this.inputPorts = null;
    this.outputPorts = null;
    this.inputParameters = null;
    this.outputParameters = null;
    this.allPorts = null;

    this.editor.getBlockHostElement().removeChild(this.el);
  }

  //数据更新
  //===========================

  public updateZoom(zoom : number) {
    this.el.style.zoom = zoom.toString();
  }
  public updateContent() {
    if(this.blockStyleSettings.smallTitle || this.blockStyleSettings.noTitle)
      this.el.setAttribute('title', this.name + '\n' + this.description);
    else{
      this.elTitleText.innerText = this.name;
      this.el.setAttribute('title', this.description);
    }
    this.el.setAttribute('data-guid', this.guid);

    this.elLogo.style.display = CommonUtils.isNullOrEmpty(this.logo) ? 'none' : 'inline-block';
    if(this.logo.startsWith('<')) this.elLogo.innerHTML = this.logo;
    else if(!CommonUtils.isNullOrEmpty(this.logo)) this.elLogo.style.backgroundImage = 'url(' + this.logo + ')';

    this.elLogoBottom.style.display = CommonUtils.isNullOrEmpty(this.blockStyleSettings.logoBottom) ? 'none' : 'inline-block';
    if(this.logo.startsWith('<')) this.elLogoBottom.innerHTML = this.blockStyleSettings.logoBottom;
    else if(!CommonUtils.isNullOrEmpty(this.elLogoBottom)) this.elLogoBottom.style.backgroundImage = 'url(' + this.blockStyleSettings.logoBottom + ')';
    
    this.elLogoRight.style.display = CommonUtils.isNullOrEmpty(this.blockStyleSettings.logoRight) ? 'none' : 'inline-block';
    if(this.logo.startsWith('<')) this.elLogoRight.innerHTML = this.blockStyleSettings.logoRight;
    else if(!CommonUtils.isNullOrEmpty(this.elLogoRight)) this.elLogoRight.style.backgroundImage = 'url(' + this.blockStyleSettings.logoRight + ')';

    this.elAddInputBehaviorPort.style.display = this.portsChangeSettings.userCanAddInputPort ? 'inline-block' : 'none';
    this.elAddOutputBehaviorPort.style.display = this.portsChangeSettings.userCanAddOutputPort ? 'inline-block' : 'none';
    
    this.elAddInputParamPort.style.display = this.parametersChangeSettings.userCanAddInputParameter ? 'inline-block' : 'none';
    this.elAddOutputParamPort.style.display = this.parametersChangeSettings.userCanAddOutputParameter ? 'inline-block' : 'none';
    
  }
  public updateSelectStatus(selected?:boolean) {
    if(typeof selected === 'boolean') this.selected = selected;

    if(this.selected) this.el.classList.add("selected");
    else this.el.classList.remove("selected");
  }
  public updateBreakPointStatus() {
    switch(this.breakpoint) {
      case 'disable':
        this.elBreakPointStatus.style.display = 'inline-block';
        this.elBreakPointStatus.classList.add('icon-tx-babianxing');
        this.elBreakPointStatus.classList.remove('icon-tx-fill-babianxing');
        this.elBreakPointStatus.setAttribute('title', '此单元已禁用断点');
        break;
      case 'enable':
        this.elBreakPointStatus.style.display = 'inline-block';
        this.elBreakPointStatus.classList.remove('icon-tx-babianxing');
        this.elBreakPointStatus.classList.add('icon-tx-fill-babianxing');
        this.elBreakPointStatus.setAttribute('title', '此单元已启用断点');
        break;
      case 'none':
        this.elBreakPointStatus.style.display = 'none';
        break;
    }
  }

  public setPos(pos ?: Vector2) {
    if(typeof pos != 'undefined')
      this.position.Set(pos);
    this.el.style.left = this.position.x + 'px';
    this.el.style.top = this.position.y + 'px';
  }


  //节点元素更新
  //===========================

  public portsChangeSettings = {
    userCanAddInputPort: false,
    userCanAddOutputPort: false,
  };

  public parametersChangeSettings : BlockParametersChangeSettings = {
    userCanAddInputParameter: false,
    userCanAddOutputParameter: false,
  };

  private addPortElement(port : BlockPort) {
    port.editorData = new BlockPortEditorData();
    port.editorData.parent = port;
    port.editorData.block = this;
    port.editorData.el = document.createElement('div');
    port.editorData.elDot = document.createElement('i');
    port.editorData.elSpan = document.createElement('span');
    port.editorData.elDeleteButton = document.createElement('a');
    port.editorData.elDeleteButton.onclick = () => this.onUserDeletePort(port);

    port.editorData.el.classList.add("port", port.type);

    port.editorData.elDeleteButton.classList.add("port-delete", "iconfont", port.type, this.portPortDeleteIcon);
    port.editorData.elDeleteButton.style.display = port.isDyamicAdd ? 'inline-block' : 'none';
    port.editorData.elDeleteButton.setAttribute('title', '删除参数');

    if(port.type == 'Parameter') {
      port.editorData.el.setAttribute('data-param-type', (<BlockParameterPort>port).paramType);
      port.editorData.el.setAttribute('data-param-custom-type', (<BlockParameterPort>port).paramCustomType);
    }else {
      port.editorData.elDot.style.color = 'rgb(253,253,253)';
    }

    port.editorData.elDot.classList.add("port-dot", "iconfont", port.type);
    port.editorData.el.setAttribute('data-port-guid', port.guid);
    port.editorData.el.setAttribute('data-block-uid', this.uid);
    port.editorData.elSpan.innerText = port.name;

    if(port.type == 'Parameter') this.createOrRecreateParamPortEditor(port, true);
    else port.editorData.el.setAttribute('title', port.description);

    port.editorData.el.addEventListener('mousedown', (e) => this.onPortMouseDown(port, e));
    port.editorData.el.addEventListener('mouseenter', () => this.onPortMouseEnter(port));
    port.editorData.el.addEventListener('mouseleave', () => this.onPortMouseLeave(port));

    //switch port and text's direction
    if(port.direction == 'input') {
      port.editorData.el.appendChild(port.editorData.elDot);
      port.editorData.el.appendChild(port.editorData.elSpan);
      if(port.editorData.elEditor != null) port.editorData.el.appendChild(port.editorData.elEditor);
      port.editorData.el.appendChild(port.editorData.elDeleteButton);
    }
    else if(port.direction == 'output') {
      port.editorData.el.appendChild(port.editorData.elDeleteButton);
      if(port.editorData.elEditor != null) port.editorData.el.appendChild(port.editorData.elEditor);   
      port.editorData.el.appendChild(port.editorData.elSpan);
      port.editorData.el.appendChild(port.editorData.elDot);
    }

    //add element node
    if(port.type == 'Behavior') {
      port.editorData.elDot.classList.add(this.portBehaviorIcon);
      if(port.direction == 'input') this.elInputBehaviorPorts.appendChild(port.editorData.el);
      else if(port.direction == 'output') this.elOutputBehaviorPorts.appendChild(port.editorData.el);
    }else if(port.type == 'Parameter') {
      port.editorData.elDot.classList.add(this.portParamIcon);
      if(port.direction == 'input') this.elInputParamPorts.appendChild(port.editorData.el);
      else if(port.direction == 'output') this.elOutputParamPorts.appendChild(port.editorData.el);
    }
  }
  private createOrRecreateParamPortEditor(port : BlockPort, isAdd = false) {
    if(port.editorData.elEditor != null) {
      port.editorData.elEditor.parentNode.removeChild(port.editorData.elEditor);
      port.editorData.elEditor = null;
    }

    let portParameter = <BlockParameterPort>port;
    let customType : BlockParameterTypeRegData = null;

    if((portParameter.paramType == 'custom' || portParameter.paramType == 'enum') 
        && !CommonUtils.isNullOrEmpty(portParameter.paramCustomType)) 
        customType = ParamTypeServiceInstance.getCustomype(portParameter.paramCustomType);

    //类型编辑器
    let editor : BlockParameterEditorRegData = null;
    if(port.direction == 'input') {
      if((portParameter.paramType == 'custom' || portParameter.paramType == 'enum') && customType !=  null){
        editor = customType.editor;
        if(editor == null && customType.prototypeName == 'enum')
          editor = AllEditors.getDefaultEnumEditor(<BlockParameterEnumRegData>customType);
      }
      else editor = AllEditors.getBaseEditors(portParameter.paramType);
    }
    
    //类型说明
    port.editorData.el.setAttribute('data-param-type-name', (customType != null ? customType.name : portParameter.paramType));
    port.editorData.el.setAttribute('data-param-type', portParameter.paramType);
    port.editorData.el.setAttribute('data-param-custom-type', portParameter.paramCustomType);
    port.editorData.elEditor = null;

    this.updatePortParamVal(port);

    if(customType != null)
      port.editorData.elDot.style.color = customType.color;
    else
      port.editorData.elDot.style.color = ParamTypeServiceInstance.getTypeColor((<BlockParameterPort>port).paramType);

    port.editorData.editor = editor;

    //创建类型编辑器
    if(editor != null) {
      port.editorData.elEditor = editor.editorCreate(port.editorData.el, portParameter, customType);
      if(port.editorData.elEditor!=null) {
        port.editorData.elEditor.classList.add('param-editor');
        if(!isAdd) {
          //switch port and text's direction
          if(port.direction == 'input')
            port.editorData.el.insertBefore(port.editorData.elEditor, port.editorData.elDeleteButton);
          else if(port.direction == 'output')
            port.editorData.el.insertBefore(port.editorData.elEditor, port.editorData.elSpan);
        }
      }
    }
  }
  public updatePortParamVal(port : BlockPort) {
    port.editorData.el.setAttribute('title', 
    port.name
    + '\n' + port.description
    + '\n类型：' + port.editorData.el.getAttribute('data-param-type-name')
    + '\n值：' + CommonUtils.valueToStr((<BlockParameterPort>port).paramValue));
  }
  private updatePortElement(port : BlockPort) {
    port.editorData.elSpan.innerText = port.name;
    port.editorData.elDeleteButton.style.display = port.isDyamicAdd ? 'inline-block' : 'none';
    if(port.type == 'Parameter') {
      port.editorData.el.setAttribute('data-param-type', (<BlockParameterPort>port).paramType);
      port.editorData.el.setAttribute('data-param-custom-type', (<BlockParameterPort>port).paramCustomType);
      this.createOrRecreateParamPortEditor(port);
    }else {
      port.editorData.el.setAttribute('title', port.description);
    }

  }
  private removePortElement(port : BlockPort) {
    port.editorData.el.parentNode.removeChild(port.editorData.el);
    port.editorData = null;
  }

  //编辑器显示状态更新

  public forceUpdateParamValueToEditor(port : BlockParameterPort) {
    if(port.editorData.editor != null)
      port.editorData.editor.forceUpdateValue(port, port.editorData.elEditor);
  }
  public updatePortConnectStatusElement(port : BlockPort) {

    //点的状态
    if(port.editorData.forceDotErrorState){
      port.editorData.elDot.classList.add("error", this.portFailedIconActive);
      port.editorData.elDot.classList.remove(this.portBehaviorIcon, this.portBehaviorIconActive, this.portParamIcon, this.portParamIconActive);
    }else {
      port.editorData.elDot.classList.remove("error", this.portFailedIconActive);
      if(port.type == 'Behavior')
        CommonUtils.setClassWithSwitch(port.editorData.elDot, port.isPortConnected() || port.editorData.forceDotActiveState,
          this.portBehaviorIcon, this.portBehaviorIconActive);
      else if(port.type == 'Parameter') 
        CommonUtils.setClassWithSwitch(port.editorData.elDot, port.isPortConnected() || port.editorData.forceDotActiveState, 
          this.portParamIcon, this.portParamIconActive);
    }

    //数值编辑器状态
    if(port.type == 'Parameter') 
    {
      if(port.editorData.elEditor != null) {
        port.editorData.elEditor.style.display = port.isPortConnected() ? 'none' : 'inline-block';
      }
    }
  }
  public markBreakPointActiveState(active : boolean) {
    if(active) {
      this.el.classList.add('breakpoint-actived');
      this.elBreakPointArrow.style.display = '';
    }
    else { 
      this.el.classList.remove('breakpoint-actived');
      this.elBreakPointArrow.style.display = 'none';
    }
  }
  public markActive() {
    this.activeFlashCount = 0;
    if(this.activeFlashInterval == null) {
      this.el.classList.add('actived');
      
      this.activeFlashInterval = setInterval(() => {
        this.el.classList.toggle('actived');
        this.activeFlashCount++;
        if(this.activeFlashCount >= 3)
          this.markDective(true);
      }, 200);
    }
  }
  public markDective(force = false) {
    if(force || this.currentRunner.stepMode) {
      this.el.classList.remove('actived');
      clearInterval(this.activeFlashInterval);
      this.activeFlashInterval = null;
  
      Object.keys(this.inputPorts).forEach(key => {
        let port = (<BlockPort>this.inputPorts[key]);
        if(port.connectedFromPort.length > 0)
          port.connectedFromPort.forEach(element => (<ConnectorEditor>element.connector).clearActive());
      });
      Object.keys(this.inputParameters).forEach(key => {
        let port = (<BlockPort>this.inputParameters[key]);
        if(port.connectedFromPort.length > 0)
          port.connectedFromPort.forEach(element => (<ConnectorEditor>element.connector).clearActive());
      });

    }
  }

  private activeFlashInterval = null;
  private activeFlashCount = 0;

  //其他事件
  //===========================

  private onUserDeletePort(port : BlockPort) {
    this.editor.getVue().$Modal.confirm({
      title: '提示',
      content: '确定删除此端口？',
      onOk: () => {
        if(port.type == 'Behavior') this.deletePort(port.guid);
        else if(port.type == 'Parameter') this.deleteParameterPort(port.guid);
      },
      onCancel: () => {}
    });
  }
  private onUserAddInputPort() {
    this.addPort(this.onUserAddPort(this, 'input'), true);
  }
  private onUserAddOutputPort() {
    this.addPort(this.onUserAddPort(this, 'output'), true);
  }
  private onUserAddInputParam() {
    this.addParameterPort(this.onUserAddParam(this, 'input'), true);
  }
  private onUserAddOutputParam() {
    this.addParameterPort(this.onUserAddParam(this, 'output'), true);
  }

  private onResize() {
    this.size.Set(
      this.el.offsetWidth,
      this.el.offsetHeight
    )
  }

  //鼠标事件
  //===========================

  //
  // 节点移动事件

  public mouseDownInPort = false;
  public mouseConnectingPort = false;

  private onPortMouseEnter(port : BlockPort) {
    this.mouseDownInPort = true;
    this.editor.updateCurrentHoverPort(port);
  }
  private onPortMouseLeave(port : BlockPort) {
    this.editor.updateCurrentHoverPortLeave(port);
    this.mouseDownInPort = false;
  }
  private onPortMouseMove(e : MouseEvent) {
    this.mouseConnectingPort = true;
    this.editor.updateConnectEnd(new Vector2(e.x, e.y));
    return true;
  }
  private onPortMouseDown(port : BlockPort, e : MouseEvent) {
    if(!this.testIsDownInControl(e)) {
      this.mouseDownInPort = true;
      this.mouseConnectingPort = false;
      this.editor.startConnect(port);
      this.editor.updateConnectEnd(new Vector2(e.x, e.y));

      this.fnonPortMouseUp = () => this.onPortMouseUp(port);

      document.addEventListener('mouseup', this.fnonPortMouseUp);
      document.addEventListener('mousemove', this.fnonPortMouseMove);

      e.stopPropagation();
    }
  }
  private onPortMouseUp(port : BlockPort) {
    this.mouseDownInPort = false;
    this.mouseConnectingPort = false;
    this.editor.endConnect(port);
    
    document.removeEventListener('mouseup', this.fnonPortMouseUp);
    document.removeEventListener('mousemove', this.fnonPortMouseMove);
  }

  //
  //单元移动事件

  public mouseDown = false;

  private mouseLastDownPos : Vector2 = new Vector2();
  private lastBlockPos : Vector2 = new Vector2();
  private lastMovedBlock = false;

  public updateLastPos() { this.lastBlockPos.Set(this.position); }
  public getLastPos() { return this.lastBlockPos; }

  private onMouseEnter(e : MouseEvent) {
    this.hover = true;
  }
  private onMouseOut(e : MouseEvent) {
    this.hover = false;
  }
  private onMouseMove(e : MouseEvent) {
    if(this.mouseDown && this.hover && !this.mouseDownInPort && !this.mouseConnectingPort) {
      let pos = new Vector2(
        this.lastBlockPos.x + (e.x - this.mouseLastDownPos.x),
        this.lastBlockPos.y + (e.y - this.mouseLastDownPos.y)
      );
      if(pos.x != this.position.x || pos.y != this.position.y) {
        this.lastMovedBlock = true;
        this.setPos(pos);
        this.editor.onMoveBlock(this, new Vector2(e.x - this.mouseLastDownPos.x, e.y - this.mouseLastDownPos.y));

        //如果当前块没有选中，在这里切换选中状态
        if(!this.selected) {
          let multiSelectBlocks = this.editor.getMultiSelectedBlocks();
          if(multiSelectBlocks.length == 0 || multiSelectBlocks.contains(this)) {
            this.updateSelectStatus(true);
            this.editor.onUserSelectBlock(this);
          }else {
            this.editor.unSelectAllBlocks();
            this.updateSelectStatus(true);
            this.editor.onUserSelectBlock(this);
          }
        }
      }
      return true;
    }
    return false;
  }
  private onMouseDown(e : MouseEvent) {
    if(!this.testIsDownInControl(e)) {
      this.mouseDown = true;
      this.mouseLastDownPos.Set(e.x, e.y);
      this.lastMovedBlock = false;
      this.lastBlockPos.Set(this.position);

      document.addEventListener('mousemove', this.fnonMouseMove);
      document.addEventListener('mouseup', this.fnonMouseUp);

      e.stopPropagation();
    }
  }
  private onMouseUp(e : MouseEvent) {
    this.mouseDown = false;

    if(this.lastMovedBlock) {
      this.editor.onMoveBlockEnd(this);
    }else {
      this.updateSelectStatus(true);
      this.editor.onUserSelectBlock(this);
    }

    document.removeEventListener('mousemove', this.fnonMouseMove);
    document.removeEventListener('mouseup', this.fnonMouseUp);
  }
  private onMouseWhell(e : WheelEvent) {
    if(this.testIsDownInControl(e)) 
      e.stopPropagation();
  }

  private testIsDownInControl(e : MouseEvent){
    let target = (<HTMLElement>e.target);
    return (target.tagName == 'INPUT' 
      || target.tagName == 'SELECT'
      || target.classList.contains('param-editor') 
      || target.classList.contains('port-delete') 
      || target.classList.contains('port')
      || target.classList.contains('custom-editor'));
  }

  private fnonMouseMove = null;
  private fnonMouseUp = null;
  private fnonPortMouseMove = null;
  private fnonPortMouseUp = null;

  private createFn() {
    this.fnonMouseUp = this.onMouseUp.bind(this);
    this.fnonMouseMove = this.onMouseMove.bind(this);
    this.fnonPortMouseMove = this.onPortMouseMove.bind(this);
  } 

  public onCreateCustomEditor : BlockEditorComponentCreateFn = null;
  public onUserAddPort : OnUserAddPortCallback = null;
  public onUserAddParam : OnUserAddParamCallback = null;
}

export type OnBlockCreateCallback = (block : Block) => void;
export type OnBlockCallback = (block : Block, port : BlockBehaviorPort) => void;
export type OnPortActiveCallback = (block : Block, port : BlockBehaviorPort) => void;
export type OnParameterUpdateCallback = (block : Block, port : BlockParameterPort) => void;


export type BlockBreakPoint = 'enable'|'disable'|'none';
