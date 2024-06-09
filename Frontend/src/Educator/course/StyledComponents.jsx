import styled from 'styled-components';

export const CommentContainer = styled.div`
  background-color: ${(props) => (props.isDarkMode ? '#1f2937' : 'white')};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: ${(props) => (props.isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)')};
  color: ${(props) => (props.isDarkMode ? 'white' : '#1f2937')};
`;

export const CommentListContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

export const CommentInputContainer = styled.div`
  display: flex;
`;
