# Face Mask Detection with YoloV5

# Run Frontend
1. `cd Frontend/`
2. `yarn install`
3. `yarn start`

# Run Backend
In order for the backend to run smoothly, [PyTorch](https://pytorch.org/get-started/locally/) must be installed with CUDA to utilize GPU for model predictions. If not, predictions will take 4-5x longer resulting in a lagging stream.
1. `cd Backend/`
2. `python -m flask run`

