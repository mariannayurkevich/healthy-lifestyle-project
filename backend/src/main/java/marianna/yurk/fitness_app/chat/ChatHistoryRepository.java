package marianna.yurk.fitness_app.chat;

import marianna.yurk.fitness_app.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findTop20ByUserOrderByTimestampDesc(User user);
}