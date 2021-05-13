import HeaderEditor from "@editorjs/header";
import ListEditor from "@editorjs/list";
import EmbedEditor from "@editorjs/embed";
import RawEditor from "@editorjs/raw";
import ImageEditor from "@editorjs/simple-image";
import QuoteEditor from "@editorjs/quote";
import CodeEditor from "@editorjs/code";
import UnderlineEditor from "@editorjs/underline";
import PersonalityEditor from "@editorjs/personality";
import ParagraphEditor from "@editorjs/paragraph";
import InlineEditor from "@editorjs/inline-code";
import TableEditor from "@editorjs/table";
import MarkerEditor from "@editorjs/marker";
import saveImage  from "./editclass";
var tool = {
    header: {
      class: HeaderEditor,
      inlineToolbar: true,
    },
    list: {
      class: ListEditor,
      inlineToolbar: true,
    },
    embed: {
      class: EmbedEditor,
      config: {
        services: {
          youtube: true,
          coub: true,
        },
      },
      inlineToolbar: true,
    },
    raw: {
      class: RawEditor,
      inlineToolbar: true,
    },
    image: {
      class: ImageEditor,
      inlineToolbar: true,
    },
    quote: {
      class: QuoteEditor,
      inlineToolbar: true,
    },
    code: {
      class: CodeEditor,
      inlineToolbar: true,
    },
    underline: {
      class: UnderlineEditor,
      inlineToolbar: true,
    },
    personality: {
      class: PersonalityEditor,
      inlineToolbar: true,
    },
    paragraph: {
      class: ParagraphEditor,
      inlineToolbar: true,
    },
    inline: {
      class: InlineEditor,
      inlineToolbar: true,
    },
    table: {
      class: TableEditor,
      inlineToolbar: true,
    },
    marker: {
      class: MarkerEditor,
      inlineToolbar: true,
    },
    imageurl: {
      class: saveImage,
      inlineToolbar: true,
    },
  };

export default tool;