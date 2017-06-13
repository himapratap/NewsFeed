$(document).ready(function() {

    $(".comments").hide();

    $(".showComments").click(function() {
            let newsId = $(this).data("news-id");
            console.log(`comments clicked #commentTable_${newsId}`);
            if (!$(`#commentTable_${newsId} table tbody`).is(':empty')) {
                console.log('not emtpy');
                $(`#commentTable_${newsId}`).toggle(1000);
            }


        }

    );

    $(".comments").on("click", ".deleteComment", function() {
        console.log('delete clicked');
        let commentId = $(this).data("comment-id");
        let newsId = $(this).closest('table').data("news-id");
        let row = $(this).closest('tr');
        console.log(commentId);
        console.log(newsId);

        $.ajax({
            url: `/news/${newsId}/comments/${commentId}`,
            type: 'DELETE',
            success: function(response) {
                console.log(`Deleted the comment ${commentId}`);
                row.remove();
            }
        })
        //

    })

});
