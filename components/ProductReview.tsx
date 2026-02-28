import ReactMarkdown from 'react-markdown';

export default function ProductReviewContainer({ reviewContent }: { reviewContent: string }) {
  return (
    <article className="review-container">    
      {/* react-markdown parses the text into proper HTML elements */}
      <ReactMarkdown>
        {reviewContent}
      </ReactMarkdown>
    </article>
  );
}