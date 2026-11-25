FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY sensor_mqtt.py ./

EXPOSE 8000

CMD ["python", "-u", "sensor_mqtt.py"]
