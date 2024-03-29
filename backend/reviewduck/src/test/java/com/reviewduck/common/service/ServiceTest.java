package com.reviewduck.common.service;

import java.util.Objects;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;

@SpringBootTest
@Sql("classpath:truncate.sql")
public class ServiceTest {

    protected Member member1;
    protected Member member2;
    protected long memberId1;
    protected long memberId2;

    @Autowired
    protected MemberRepository memberRepository;
    @Autowired
    private CacheManager cacheManager;

    @BeforeEach
    void setUp() {
        Member tempMember1 = new Member("1", "jason", "제이슨", "testUrl1");
        member1 = memberRepository.save(tempMember1);
        memberId1 = member1.getId();

        Member tempMember2 = new Member("2", "woni", "워니", "testUrl2");
        member2 = memberRepository.save(tempMember2);
        memberId2 = member2.getId();

        clearCache();
    }

    private void clearCache() {
        for (String name : cacheManager.getCacheNames()) {
            Objects.requireNonNull(cacheManager.getCache(name)).clear();
        }
    }
}
