import styled from 'styled-components';

export const VideoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 150px;
`;

export const VideoPlayer = styled.video`
    width: 65%;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const VideoDetails = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    margin-left: 20px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const VideoTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
`;

export const VideoDescription = styled.p`
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
`;

export const VideoViews = styled.div`
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    svg {
        margin-right: 5px;
    }
`;

export const LikeButton = styled.button`
    background-color: ${(props) => (props.$userLiked ? '#007bff' : '#ccc')};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    font-weight: bold;

    &:hover {
        background-color: ${(props) => (props.$userLiked ? '#0056b3' : '#999')};
    }
`;

export const CommentSectionContainer = styled.div`
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
`;

export const CommentList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

export const CommentItem = styled.li`
    padding: 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    flex-direction: column;

    &:last-child {
        border-bottom: none;
    }

    & > p {
        margin: 0;
    }
`;

export const CommentInputContainer = styled.div`
    display: flex;
    position: sticky;
    bottom: 0;
    background-color: #f9f9f9;
    padding: 10px 0;
`;

export const CommentInput = styled.input`
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px 0 0 5px;
    outline: none;
`;

export const CommentSubmitButton = styled.button`
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        background-color: #218838;
    }
`;
