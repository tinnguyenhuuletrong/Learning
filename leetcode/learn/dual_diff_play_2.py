# https://blog.esciencecenter.nl/automatic-differentiation-from-scratch-23d50c699555

from numbers import Number
from dualdiff.dual import Dual
import dualdiff.primitives as primitives
from dualdiff.decorators import autodifferentiable
import matplotlib.pyplot as plt
from tqdm import tqdm
import imageio
import numpy as np
from io import BytesIO
from PIL import Image

@autodifferentiable
def f(x):
    return x** 2 - 5*x + 6 - (5*x)**3 - 5 * primitives.exp(-50 * x **2)

res : Dual = f(0)
print("Function:")
print("\t", "f3(x)=x^2 - 5x + 6 - 5x^3 - 5 * exp(-50 * x^2)")

X_RANGE = [-0.7,0.7]
SAMPLES = 100
step = (X_RANGE[1]- X_RANGE[0]) / SAMPLES
X = np.arange(start=X_RANGE[0], stop=X_RANGE[1], step=step)
Y = list(map(lambda x : f(x), X))
Y_val = list(map(lambda x: x.x, Y))
min_y = np.min(Y_val)
max_y = max(Y_val)

frames = []
def create_frame(idx:Number):
    buffer = BytesIO()

    dx = Y[idx].dx
    y0 = Y[idx].x
    x0 = X[idx]
    tangent_line = lambda x: y0 + dx * (x - x0)

    fig = plt.figure(figsize=(6, 6))
    plt.plot(X, Y_val, color = 'blue' )
    plt.plot(X, list(map(tangent_line,X)), color = 'red')
    plt.scatter(x0,y0, c='black', s=20)
    plt.grid()

    plt.xlim(X_RANGE)
    plt.ylim([min_y,max_y])

    plt.savefig(buffer, 
                format='png',
                transparent = False,  
                facecolor = 'white'
               )
    
    frames.append(Image.open(buffer))
    plt.close()

print('Generate frames')
for i in tqdm(range(len(X))):
    create_frame(i)

print('Export to gif')
imageio.mimsave('./out_dual_diff_play_2.gif', # output gif
    frames,          # array of input frames
    fps = 30        # optional: frames per second
)