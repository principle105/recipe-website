import React, { useRef, useCallback, useState } from "react";
import { RichUtils, EditorState, convertFromRaw } from "draft-js";
import { useNavigate } from "react-router-dom";

import Editor from "@draft-js-plugins/editor";
import createFocusPlugin from "@draft-js-plugins/focus";
import createToolbarPlugin, {
    Separator,
} from "@draft-js-plugins/static-toolbar";
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    UnorderedListButton,
    OrderedListButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
} from "@draft-js-plugins/buttons";
import createTextAlignmentPlugin from "@draft-js-plugins/text-alignment";
import createUndoPlugin from "@draft-js-plugins/undo";
import createLinkifyPlugin from "@draft-js-plugins/linkify";

import "@draft-js-plugins/text-alignment/lib/plugin.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "@draft-js-plugins/focus/lib/plugin.css";
import "@draft-js-plugins/undo/lib/plugin.css";
import "@draft-js-plugins/linkify/lib/plugin.css";

import styles from "../styles/components/RichTextEditor.module.scss";

const theme = {
    undo: styles.undo_btn,
    redo: styles.undo_btn,
};

const staticToolbarPlugin = createToolbarPlugin();
const focusPlugin = createFocusPlugin();
const textAlignmentPlugin = createTextAlignmentPlugin();
const linkifyPlugin = createLinkifyPlugin();
const undoPlugin = createUndoPlugin({
    undoContent: "Undo",
    redoContent: "Redo",
    theme,
});

const { UndoButton, RedoButton } = undoPlugin;
const { Toolbar } = staticToolbarPlugin;

const plugins = [
    staticToolbarPlugin,
    focusPlugin,
    textAlignmentPlugin,
    undoPlugin,
    linkifyPlugin,
];

const RichTextEditor = ({
    readOnly,
    save,
    deleteRecipe,
    initialTitle,
    initialEditor,
}) => {
    let initialState = null;

    // Creating the initial state of the editor
    if (initialEditor) {
        const rawContent = convertFromRaw(initialEditor);
        initialState = EditorState.createWithContent(rawContent);
    } else {
        initialState = EditorState.createEmpty();
    }

    const [editorState, setEditorState] = useState(initialState);

    const [title, setTitle] = useState(initialTitle || "");

    const editor = useRef(null);

    const navigate = useNavigate();

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return "handled";
        }
        return "not-handled";
    };

    const focusEditor = useCallback(() => {
        if (editor.current) {
            editor.current.focus();
        }
    }, [editor]);

    return (
        <section className={styles.container}>
            {!readOnly ? (
                <div className={styles.title}>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                    />
                </div>
            ) : (
                <h1>{title}</h1>
            )}

            <div className={styles.recipe}>
                <div className={styles.editor} onClick={focusEditor}>
                    <Editor
                        ref={editor}
                        editorState={editorState}
                        onChange={(state) => {
                            if (!readOnly) {
                                setEditorState(state);
                            }
                        }}
                        handleKeyCommand={handleKeyCommand}
                        spellCheck={true}
                        plugins={plugins}
                    />
                </div>
                {!readOnly ? (
                    <Toolbar>
                        {(externalProps) => (
                            <>
                                <BoldButton {...externalProps} />
                                <ItalicButton {...externalProps} />
                                <UnderlineButton {...externalProps} />
                                <Separator {...externalProps} />
                                <HeadlineOneButton {...externalProps} />
                                <HeadlineTwoButton {...externalProps} />
                                <HeadlineThreeButton {...externalProps} />
                                <UnorderedListButton {...externalProps} />
                                <OrderedListButton {...externalProps} />
                                <textAlignmentPlugin.TextAlignment
                                    {...externalProps}
                                />
                                <Separator {...externalProps} />
                                <UndoButton {...externalProps} />
                                <RedoButton {...externalProps} />
                            </>
                        )}
                    </Toolbar>
                ) : null}
            </div>
            <div className={styles.action_btns}>
                <button
                    className={styles.back_btn}
                    onClick={() => {
                        if (
                            window.history.state &&
                            window.history.state.idx > 0
                        ) {
                            navigate(-1);
                        } else {
                            navigate("/", { replace: true });
                        }
                    }}
                >
                    Back
                </button>
                {!readOnly ? (
                    <>
                        {initialTitle ? (
                            <button
                                className={styles.delete_btn}
                                onClick={deleteRecipe}
                            >
                                Delete
                            </button>
                        ) : null}
                        <button
                            className={styles.save_btn}
                            onClick={() => save(title, editorState)}
                        >
                            Save
                        </button>
                    </>
                ) : null}
            </div>
        </section>
    );
};

export default RichTextEditor;
