import { createComment } from "../controllers/post.controller";
import { getPostById, savePostComment } from "../services/post.services";
import { errorResponse, successRes } from "../helpers/response";
import { mockRequest, mockResponse, mockNext } from "./__mocks__/mocks";

jest.mock("../services/post.services", () => ({
  getPostById: jest.fn(),
  savePostComment: jest.fn(),
}));

jest.mock("../helpers/response", () => ({
  errorResponse: jest.fn(),
  successRes: jest.fn(),
}));

describe("Comment Controller - createComment", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a comment for an existing post", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    const mockUser = { id: 1, username: "user123" };
    req.user = mockUser;

    const mockPostId = 1;
    req.params.postId = mockPostId;

    const mockContent = "This is a comment.";
    req.body.content = mockContent;

    const mockPost = {
      id: mockPostId,
      title: "Test Post",
      content: "Test Content",
    };
    (getPostById as jest.Mock).mockResolvedValue(mockPost);

    const mockComment = { id: 1, content: mockContent };
    (savePostComment as jest.Mock).mockResolvedValue(mockComment);

    await createComment(req, res, next);

    expect(getPostById).toHaveBeenCalledWith(mockPostId);
    expect(savePostComment).toHaveBeenCalledWith({
      post_id: mockPostId,
      user_id: mockUser.id,
      content: mockContent,
    });
    expect(successRes).toHaveBeenCalledWith(res, mockComment);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error response if post does not exist", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    const mockPostId = 1;
    req.params.postId = mockPostId;

    (getPostById as jest.Mock).mockResolvedValue(null);

    await createComment(req, res, next);

    expect(getPostById).toHaveBeenCalledWith(mockPostId);
    expect(errorResponse).toHaveBeenCalledWith(res, "Post not found", 404);
    expect(successRes).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next function in case of an error", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    const mockUser = { id: 1, username: "user123" };
    req.user = mockUser;

    const mockPostId = 1;
    req.params.postId = mockPostId;

    const mockContent = "This is a comment.";
    req.body.content = mockContent;

    (getPostById as jest.Mock).mockRejectedValue(new Error("Database error"));

    await createComment(req, res, next);

    expect(getPostById).toHaveBeenCalledWith(mockPostId);
    expect(errorResponse).not.toHaveBeenCalled();
    expect(successRes).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
