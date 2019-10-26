# streamlit run streamlit_hello.py

# https://towardsdatascience.com/full-stack-ai-building-a-ui-for-your-latest-ai-project-in-no-time-at-all-7e5c8fd4eafd
# https://github.com/Poseyy/StreamlitDemo?source=post_page-----7e5c8fd4eafd----------------------

import streamlit as st

x = st.slider('Select a value')
st.write(x, 'squared is', x * x)
