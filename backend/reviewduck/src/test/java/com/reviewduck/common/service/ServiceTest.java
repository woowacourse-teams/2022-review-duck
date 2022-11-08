package com.reviewduck.common.service;

import javax.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.member.service.MemberService;
import com.reviewduck.review.repository.ReviewFormRepository;
import com.reviewduck.review.service.ReviewFormService;
import com.reviewduck.review.service.ReviewService;
import com.reviewduck.template.service.TemplateService;

@SpringBootTest
@Sql("classpath:truncate.sql")
@Transactional
public class ServiceTest {

    protected Member member1;
    protected Member member2;
    protected long memberId1;
    protected long memberId2;

    @Autowired
    protected TemplateService templateService;
    @Autowired
    protected ReviewFormRepository reviewFormRepository;
    @Autowired
    protected ReviewService reviewService;
    @Autowired
    protected MemberService memberService;
    @Autowired
    protected ReviewFormService reviewFormService;
    @Autowired
    protected MemberRepository memberRepository;

    @BeforeEach
    void setUp() {
        Member tempMember1 = new Member("1", "jason", "제이슨", "testUrl1");
        member1 = memberRepository.save(tempMember1);
        memberId1 = member1.getId();

        Member tempMember2 = new Member("2", "woni", "워니", "testUrl2");
        member2 = memberRepository.save(tempMember2);
        memberId2 = member2.getId();
    }
}
