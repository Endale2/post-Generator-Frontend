import React, { useState } from 'react';
import { FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsCard = ({ title, description, link }) => {
  const [copyText, setCopyText] = useState('Copy');

  // Function to process the description
  const processDescription = (desc) => {
    let processedDesc = desc.replace(/^\d+\.\s*/, '');

    const urlSquareBracketRegex = /\[.*?\]\((https?:\/\/[^\)]+)\)/;
    let match = processedDesc.match(urlSquareBracketRegex);
    let url = '';
    if (match) {
      url = match[1];
      processedDesc = processedDesc.replace(match[0], '').trim();
    }

    const urlParenthesesRegex = /\((https?:\/\/[^\)]+)\)/;
    match = processedDesc.match(urlParenthesesRegex);
    if (match) {
      url = match[1];
      processedDesc = processedDesc.replace(match[0], '').trim();
    }

    const hashtagsRegex = /(#\w+(\s+#\w+)*)/;
    const hashtagsMatch = processedDesc.match(hashtagsRegex);
    if (hashtagsMatch) {
      processedDesc = processedDesc.replace(hashtagsRegex, `\n\n${hashtagsMatch[0]}`);
    }

    if (url) {
      processedDesc += `\n\nRead more: ${url}`;
    }

    return processedDesc;
  };

  const formattedDescription = processDescription(description);

  // Handle Copy button click
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedDescription)
      .then(() => {
        toast.success('Content copied to clipboard!');
        setCopyText('Copied');
        setTimeout(() => {
          setCopyText('Copy');
        }, 2000); // Change back to 'Copy' after 2 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  const readMoreLink = formattedDescription.match(/Read more: (https?:\/\/[^\s]+)/);
  const readMoreUrl = readMoreLink ? readMoreLink[1] : link;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mx-4 my-4 max-w-xs sm:max-w-md md:max-w-lg">
      <div className="p-3 sm:p-4 space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {formattedDescription}
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-3 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base"
          >
            <FaCopy className="mr-1 sm:mr-2" /> {copyText}
          </button>
          <a
            href={readMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-3 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base"
          >
            <FaExternalLinkAlt className="mr-1 sm:mr-2" /> Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
