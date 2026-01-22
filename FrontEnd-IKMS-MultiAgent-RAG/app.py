import streamlit as st
import requests

# Page configuration
st.set_page_config(page_title="IKMS Multi-Agent RAG", page_icon="🔍", layout="wide")

st.title("🔍 IKMS-Multi-Agent RAG: Query Planning Extension")
st.markdown("---")

# User Input Section
query = st.text_input("What can I help with?", 
                     placeholder="e.g., What are the financials of XYZ Company Limited?")

if st.button("Analyze & Answer"):
    if query:
        with st.spinner("Agents are collaborating to plan and retrieve..."):
            try:
                # URL of your FastAPI backend (adjust if port is different)
                backend_url = "http://localhost:8000/qa"
                payload = {"question": query}
                
                response = requests.post(backend_url, json=payload)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # 1. Feature 1: Display the Planning Strategy
                    st.subheader("📋 Phase 1: Query Planning & Decomposition")
                    st.info(f"**Strategic Plan:** {data.get('plan', 'No plan generated.')}")
                    
                    # Display sub-questions in columns for better visualization
                    sub_qs = data.get('sub_questions', [])
                    if sub_qs:
                        st.write("**Decomposed Sub-queries:**")
                        cols = st.columns(len(sub_qs))
                        for i, sub_q in enumerate(sub_qs):
                            with cols[i]:
                                st.success(f"**Query {i+1}**\n\n{sub_q}")
                    
                    st.markdown("---")
                    
                    # 2. Display the Final Verified Answer
                    st.subheader("🤖 Phase 2: Final Verified Answer")
                    st.write(data.get('answer', "No answer returned."))
                    
                    # 3. Context Expander (for verification)
                    with st.expander("📚 View All Retrieved Context Chunks"):
                        st.write(data.get('context', "No context retrieved."))
                else:
                    st.error(f"Backend Error: {response.status_code} - {response.text}")
                    
            except Exception as e:
                st.error(f"Could not connect to the backend server. Error: {e}")
    else:
        st.warning("Please enter a question before clicking 'Analyze & Answer'.")