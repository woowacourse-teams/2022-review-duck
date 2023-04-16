import { useNavigate } from 'react-router-dom';

function useNavigateHandler() {
  const navigate = useNavigate();
  const handleLinkPage = (href: string) => () => navigate(href);

  return { handleLinkPage, navigate };
}

export default useNavigateHandler;
