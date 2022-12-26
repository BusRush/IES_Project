package ies.project.busrush.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class CacheRepository {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void save(String s,Object object) {
        redisTemplate.opsForValue().set(s, object);
    }

    public Object get(String s) {
        return redisTemplate.opsForValue().get(s);
    }
}
