import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, Sanitizer, SimpleChanges} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CategoryService} from '../../../shared/service/category.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-tiny-mice',
  templateUrl: './tiny-mice.component.html',
  styleUrls: ['./tiny-mice.component.scss']
})
export class TinyMiceComponent implements OnInit , OnChanges  {



  public valueeee: any;
  ////tinymicee //
  @Output() emitEditorValue = new EventEmitter<any>();
  @Input() editorPatchValue: any;
  @Input() readonly: boolean;
  @Input() height: number;
  @Input() width: number;
  @Input() id: any;
  @Input() showInputBtn: boolean;
  @Input() showDropBtn: boolean;
  @Input() hideBackcolr: boolean;
  @Input() imageToolHide: boolean;
  @Input() inlineEditor?: boolean = false;

  // public editorSet: any;
  public editorConf : any;
  public showLoader : boolean = true;
  public editorParent: any;
  public parentCb: any;
  public imgUrl: any;
  public getRandom: any;

  //// tiny mice closed

  constructor(public auth: AuthService, public sanitizer: DomSanitizer, public category: CategoryService , public config: ConfigurationService) {
    ///// hiding bacground coldr toolbar in the editor
    this.hideBackcolr = this.hideBackcolr ? this.hideBackcolr : false;
    this.imageToolHide = this.imageToolHide ? this.imageToolHide : false;
    this.imgUrl = this.config?.getimgUrl();
  }

  ngOnChanges(changes: SimpleChanges): void {

    // // set read only funtionlity
      if (this.readonly){
        this.editorParent?.mode?.set('readonly');
      }else{
        this.editorParent?.mode?.set('design');
      }
  }

  ngOnInit(): void {

    let toolbar: string;
    if (this.hideBackcolr){
      toolbar = ' undo redo | formatselect | imagetools | \\\n' +
          '      alignleft aligncenter alignright alignjustify | \\\n' +
          '      tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry  customInsertButton mybutton image | \\\n' +
          '      bullist numlist outdent indent | removeformat | help';
    } else if (this.imageToolHide) {
      toolbar = ' undo redo | formatselect | bold italic forecolor backcolor | \\\n' +
          '      alignleft aligncenter alignright alignjustify | \\\n' +
          '      tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry  customInsertButton mybutton | \\\n' +
          '      bullist numlist outdent indent | removeformat | help';
    }
    else{
      toolbar = 'undo redo | formatselect | bold italic forecolor backcolor imagetools | \\\n' +
          '      alignleft aligncenter alignright alignjustify | \\\n' +
          '      tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry  customInsertButton mybutton image | \\\n' +
          '      bullist numlist outdent indent | removeformat | help';
    }
    let input : any;
    this.imgUrl = this.config?.getimgUrl();
    this.getRandom = Math.random().toFixed(6);

    this.editorConf = {
      height: this.height ? this.height : 110,
      width: this.width ? this.width : '100%',
      menubar: false,
      inline: this.inlineEditor,
      hidden_input: false,
      body_class: 'inlineEditor',
      branding: false,
      // a11y_advanced_options: true,
      file_picker_types: 'image',
      paste_data_images: true,
      paste_as_text: true,
      image_advtab: false,
      image_uploadtab: true,
      relative_urls : false,
      remove_script_host : false,
      convert_urls : true,
      draggable_modal: true,
      elementpath: false,
      toolbar_mode: 'sliding',
      toolbar_sticky: false,
      // images_upload_base_path: this.imgUrl,
      // images_upload_base_path: this.config?.getimgUrl() + '/' ,
      file_picker_callback:  (cb, value, meta) => {
        console.log(this.config?.getimgUrl() , 'this.config?.getimgUrl()')
        console.log(cb , 'cb')
        console.log(value , 'value')
        console.log(meta , 'meta')
        this.parentCb = cb;
        input = document.getElementById('imageUpload' + this.getRandom);
        console.log(input, 'input')
        input.click();
      },
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount image imagetools'
      ],
      // plugins: [
      //   'image'
      // ],
      setup: editor => {
        this.editorParent = editor;
        // console.log(editor , 'editor');
        editor.on('init', () => {
          this.showLoader = false;
          if (this.readonly){
            editor.mode.set('readonly');
          }
          if (this.editorPatchValue){
            editor.setContent(this.editorPatchValue || '');

          }
          const content = editor.getContent();
          let content1 = {
            editor,
            content
          }
          this.emitEditorValue.emit(content1);
        });
        editor.on('change', () => {
          const content = editor.getContent();
          if (this.readonly){
            editor.mode.set('readonly');
          }
          // if (this.editorPatchValue){
          //   editor.setContent(this.editorPatchValue || '');
          // }
          let content1 = {
            editor,
            content
          };
          this.emitEditorValue.emit(content1);
        });
        editor.on('keyup', () => {
          const content = editor.getContent();
          let content1 = {
            editor,
            content
          }
          this.emitEditorValue.emit(content1);
        });
        if(this.showDropBtn){
          editor.ui.registry.addButton('mybutton', {
            type: 'menubutton',
            text: 'Add Drop Down',
            onAction: function (_) {
              editor.insertContent('<input class="dropDownValue" readonly placeholder="DropDown box">');
            }

          });
        }
        if (this.showInputBtn){
          editor.ui.registry.addButton('customInsertButton', {
            text: 'Add Input',
            onAction: function (_) {
              editor.insertContent('<input class="inputValue" readonly placeholder="input box">');
              // openInputDialog();
            }
          });

        }
      },
      external_plugins: {
        tiny_mce_wiris: 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js'
      },
      toolbar
    };

  }

  // manuallTrigger1(event){
  //   this.editorSet = event.editor;
  // }
  // manuallTrigger(){
  //   console.log(this.editorSet , 'set');
  //
  // }




  encodeImageFileAsURL(event: any){
    console.log(event ,'lkhljl')
    for (let i = 0; i < event.target.files.length; i++) {
      const getUrlEdu = '';
      const imgDetails = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const url = event.target.result;
        const getUrl = url.split(',');
        const pic = imgDetails.type.split('/');
        if (pic[1] == 'jpeg' || pic[1] == 'png' || pic[1] ==  'jpg' ){
          this.onUploadKYCFinished(getUrl, imgDetails);
        } else{
          console.error('JPEG ,PNG & JPG are the required type');
        }
      };
      reader.readAsDataURL(event.target.files[i]);
    }
  }

  onUploadKYCFinished(getUrlEdu, data){
    let recordBase64Url =  getUrlEdu[1];
    let imgData = [{
      image: recordBase64Url,
      size: data.size,
      type: data.type,
      name: data.name
    }];
    this.getUrlImage(imgData);
  }

  getUrlImage(imgData) {
    const data = {
      platform: 'web',
      role_id: this.auth.getRoleId(),
      user_id: this.auth.getUserId(),
      image_path: imgData,
      uploadtype: 'profile'
    };
    this.category.getImgUrl(data).subscribe(
        (successData) => {
          this.getUrlImageSuccess(successData);
        },
        (error) => {
          this.getUrlImageFailure(error);
        }
    );
  }
  public  getUrlImageSuccess(successData) {
    if (successData.IsSuccess) {
      console.log(this.config?.getimgUrl() + '/' + successData.ResponseObject.imagepath[0].original_image_url, 'path');
      this.parentCb(this.config?.getimgUrl() + '/' + successData.ResponseObject.imagepath[0].original_image_url, { title: 'RISTA' });
      let input: any = document.getElementById('imageUpload' + this.getRandom) as HTMLElement;
      input.value = '';

    }
  }
  public  getUrlImageFailure(error) {
    console.log(error);
  }
}
