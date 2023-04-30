import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1);
  };
  return (
    <div className="container">
      <div className="back-button">
        <button onClick={handleReturn}>
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.342.886L2.114 5.114l4.228 4.228" stroke="#9277FF" stroke-width="2" fill="none" fill-rule="evenodd" />
          </svg>
          Go back
        </button>
      </div>
    </div>
  );
}
