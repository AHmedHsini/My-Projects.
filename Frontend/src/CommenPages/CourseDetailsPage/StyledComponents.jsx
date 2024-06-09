import styled from 'styled-components';

export const CategoryContainer = styled.div`
  margin-top: 5%;
  margin-left: 5%;
  max-width: 55%;
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex; /* Use flexbox */
  align-items: center; /* Align items vertically */
  white-space: nowrap;  /* Prevent text from wrapping */
  overflow: hidden;  /* Hide any overflowing text */
  text-overflow: ellipsis;  /* Add ellipsis for overflowing text */

  @media (max-width: 768px) {
    margin-left: 3%;
    max-width: 90%;
  }
`;
export const CourseCardStyled = styled.div`
  background-color: white;
  margin-top: 11%;
  padding: 16px;
  border-radius: 0px 0px 8px 8px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0px 4px rgba(0, 0, 0, 0.1); 
  position: fixed;
  right: 14%;
  width: 25.5%;

  @media (max-width: 768px) {
    position: static;
    width: 90%;
    margin: 20px auto;
  }
`;

export const VideoList = styled.div`
  overflow-y: auto;
  max-height: 700px;
  margin-left: 5%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  flex-direction: column;
  

  @media (max-width: 768px) {
    margin-left: 0;
    max-height: 400px;
  }
`;

export const VideoListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;

    &:hover {
      background-color: transparent;
      box-shadow: none;
      transform: none;
    }
  }

  .progress-bar {
    width: 100%;
    height: 5px;
    background-color: #ccc;
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    position: relative;
  }

  .progress {
    height: 100%;
    background-color: #4caf50;
  }
`;

export const QuizzesList = styled.div`
  width: 80%;
  margin-left: 5%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 90%;
    margin-left: 0;
    padding: 12px;
  }
`;

export const QuizItem = styled.div`
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;

    &:hover {
      background-color: transparent;
      box-shadow: none;
      transform: none;
    }
  }
`;

export const QuizListContainer = styled.div`
  overflow-y: auto;
  max-height: 200px;
  margin-bottom: 8px;
`;

export const PdfList = styled.div`
  width: 80%;
  margin-left: 5%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 90%;
    margin-left: 0;
    padding: 12px;
  }
`;

export const PdfListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;

    &:hover {
      background-color: transparent;
      box-shadow: none;
      transform: none;
    }
  }
`;

export const PdfListContainer = styled.div`
  overflow-y: auto;
  max-height: 200px;
  margin-bottom: 8px;
`;

export const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-left: 5%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;

  @media (max-width: 768px) {
    width: 90%;
    margin-left: 0;
    padding: 12px;
  }
`;

export const CommentInputContainer = styled.div`
  display: flex;
  margin-top: 8px;
  border-top: 1px solid #ccc;
  padding-top: 8px;
`;

export const CommentListContainer = styled.div`
  overflow-y: auto;
  max-height: 200px;
  margin-bottom: 8px; 
`;

export const RatingContainer = styled.div`
  width: 80%;
  margin-left: 5%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;

  @media (max-width: 768px) {
    width: 90%;
    margin-left: 0;
    padding: 12px;
  }
`;
