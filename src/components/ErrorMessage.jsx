import './ErrorMessage.css';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <p className="error-message__title">Something went wrong</p>
      <p className="error-message__body">{message}</p>
      {onRetry && (
        <button type="button" className="error-message__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
