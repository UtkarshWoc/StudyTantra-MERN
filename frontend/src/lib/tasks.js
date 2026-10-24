// Where a study-plan task takes the student
export const taskLink = (task) => {
  const doc = task.document?._id || task.document;
  const topic = task.topic ? `&topic=${encodeURIComponent(task.topic)}` : '';
  switch (task.type) {
    case 'flashcards':
    case 'review':
      return doc ? `/review?document=${doc}` : '/review';
    case 'quiz':
      return doc ? `/quizzes?document=${doc}${topic}` : '/quizzes';
    default:
      return doc ? `/documents/${doc}` : '/documents';
  }
};
