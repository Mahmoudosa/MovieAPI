import { useParams } from 'react-router-dom';
import ArticleEditor from './ArticleEditor';

function EditArticle() {
  const { id } = useParams();
  return <ArticleEditor key={id} edit />;
}

export default EditArticle;
