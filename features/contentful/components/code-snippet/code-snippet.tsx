import React from "react";
import { ICodeSnippet } from "../../type";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * CodeSnippet Component
 *
 * Renders a syntax-highlighted code block using react-syntax-highlighter.
 *
 * @param {ICodeSnippet} entry - The code snippet entry from Contentful.
 * @returns {JSX.Element} A styled code block with syntax highlighting.
 */
const CodeSnippet: React.FC<ICodeSnippet> = ({ fields }) => {
  // Destructure fields for better readability
  const { language = "plaintext", codeBlock } = fields || {};

  // Handle case where codeBlock is empty or undefined
  if (!codeBlock) {
    return <p className="text-gray-400 italic">No code available</p>;
  }

  return (
    <div className="relative w-full rounded-lg bg-zinc-900 p-4 border border-zinc-700">
      {/* Syntax-highlighted code block */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        wrapLongLines // Ensures long lines don't overflow
      >
        {codeBlock}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeSnippet;
