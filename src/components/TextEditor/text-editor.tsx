
import React, { useCallback, useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-named-as-default
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure Quill's CSS is imported

import { CommonApi } from '@/utils/api/api';

import "./styles.scss";

interface TextEditorInterface {
  onChange: (content: string) => void;
  defaultValue?: string;
}

export function TextEditor({
  defaultValue,
  onChange
}: TextEditorInterface): React.JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null); // Create a ref for the editor container
  const quillRef = useRef<Quill | null>(null);  // To store the Quill instance
  const initialValueRef = useRef(defaultValue || '');

  const imageHandler = (): void => {
    const editor = quillRef.current;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files) {
        const file = input.files[0];
        if (file.type.startsWith("image")) {
          const formData = new FormData();
          formData.append("file", file);
          const data = await new CommonApi().uploadImage(formData);
          const url = data.url;
          const range = quillRef.current?.getSelection(true);
          if (editor) {
            editor.insertEmbed(range?.index || 0, "image", url);
          }
        } else {
          // eslint-disable-next-line no-console
          console.error('Upload failed')
        }
      }
    };
  }

  const uploadImage = useCallback(async (blob: Blob): Promise<void> => {
    const formData = new FormData();
    formData.append('file', blob);
    const range = quillRef.current?.getSelection();
    if (range && quillRef.current) {
      quillRef.current?.deleteText(range);
      onChange(quillRef.current?.root.innerHTML)
    }
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
          ],
          handlers: {
            images: imageHandler
          }
        },
      });
    }
    const toolbar = quillRef.current?.getModule('toolbar');
    toolbar.addHandler('image', imageHandler);
    // quillRef.current?.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any) => {
    //   console.log("node", node);
    // })
    quillRef.current?.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        if (quillRef.current?.root.innerHTML) {
          onChange(quillRef.current?.root.innerHTML)
        }
      }
    })

    const insertInitialValue = () => {
      quillRef.current?.clipboard.dangerouslyPasteHTML(0, initialValueRef.current);
      quillRef.current?.blur();
    };
    insertInitialValue();

    // const handlePaste = (e: ClipboardEvent): void => {
    //   const clipboardData = e.clipboardData || window['ClipboardEvent'].clipboardData;
    //   const items = clipboardData.items;
    //   // for (const item of items) {
    //   //   console.log("item.type", item.type);
    //   //   if (item.type.indexOf('image') > -1) {
    //   //     e.preventDefault();  // Prevent the default paste behavior

    //   //     const blob = item.getAsFile() as Blob;
    //   //     uploadImage(blob);  // Handle the blob file (upload it or whatever you need to do)
    //   //   }
    //   // }
    // };

    // Add the event listener
    // quillRef.current?.root.addEventListener('paste', handlePaste);

    // Specify how to clean up after this effect:
    return () => {
      if (quillRef.current) {
        // quillRef.current?.root.removeEventListener('paste', handlePaste);
        quillRef.current = null;
      }
    };
  }, [onChange, uploadImage]); // Empty dependency array means this effect runs only once (like componentDidMount)

  return (
    <div ref={editorRef} style={{ height: 300 }} /> // Set a height for the editor container
  );
}
